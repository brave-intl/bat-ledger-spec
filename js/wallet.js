/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

const Immutable = require('immutable')
const sinon = require('sinon')

const Wallet = require('../abs/wallet')
const {request, roundtrip} = require('../lib/request')
const settings = require('../browser-laptop/js/constants/settings')

const defaultAppState = Immutable.fromJS({
  cache: {
    ledgerVideos: {}
  },
  ledger: {
    about: {}
  },
  about: {
    preferences: {}
  }
})

class JS extends Wallet {
  constructor () {
    super()
    this.ledger = null
    this.minimumVisits = 1
    this.minimumVisitTime = 5000
    this.defaultContribution = 10
    this.paymentsEnabled = false
    this.state = defaultAppState
    this.stateFile = null
  }

  setStateFile () {
    const ledgerStateData = require('../lib/data/ledger-state.json')
    this.stateFile = JSON.stringify(ledgerStateData)
  }

  before (mockery) {
    const self = this
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    })

    const fakeElectron = require('../test/fixtures/fakeElectron')
    const fakeAdBlock = require('../test/fixtures/fakeAdBlock')
    const fakeLevel = require('../test/fixtures/fakeLevel')

    mockery.registerMock('electron', fakeElectron)
    mockery.registerMock('level', fakeLevel)
    mockery.registerMock('ad-block', fakeAdBlock)
    mockery.registerMock('../../../js/lib/request', {
      request: request
    })
    mockery.registerMock('../../../js/settings', {
      getSetting: (key) => {
        switch (key) {
          case settings.PAYMENTS_MINIMUM_VISITS:
          {
            return self.minimumVisits
          }
          case settings.PAYMENTS_MINIMUM_VISIT_TIME:
          {
            return self.minimumVisitTime
          }
          case settings.PAYMENTS_CONTRIBUTION_AMOUNT:
          {
            return self.defaultContribution
          }
          case settings.PAYMENTS_ENABLED:
          case settings.PAYMENTS_NOTIFICATION_TRY_PAYMENTS_DISMISSED:
          {
            return true
          }
        }
      }
    })

    this.ledger = require('../browser-laptop/app/browser/api/ledger')
    this.ledgerStatuses = require('../browser-laptop/app/common/constants/ledgerStatuses')
    this.setStateFile()

    this.callback = sinon.stub(this.ledger, 'callback').callsFake(function (err, result, delayTime) {
      if (err) {
        return
      }
      if (typeof delayTime === 'undefined') {
        delayTime = Math.floor(Math.random() * (5 * 60 * 1000))
      }
      self.state = self.ledger.onCallback(self.state, result, delayTime)
    })

    this.roundtrip = sinon.stub(this.ledger, 'roundtrip').callsFake(function (params, options, callback) {
      roundtrip(params, options, callback)
    })

    this.getBalance = sinon.stub(this.ledger, 'getBalance').callsFake(function (state) {
      self.state = self.ledger.getPaymentInfo(state)
      return self.state
    })

    this.recoverWalletCallback = sinon.stub(this.ledger, 'recoverWalletCallback').callsFake(function (error, result) {
      result = Immutable.fromJS(result)
      self.state = self.ledger.onWalletRecovery(self.state, error, result)
    })

    this.publisherTimestampCallback = sinon.stub(this.ledger, 'publisherTimestampCallback').callsFake(function (err, result) {
      if (err) {
        return self.state
      }
      self.ledger.onPublisherTimestamp(self.state, result.timestamp, false)
    })

    this.getWalletPropertiesCallback = sinon.stub(this.ledger, 'getWalletPropertiesCallback').callsFake(function (err, body) {
      if (err) {
        return self.state
      }
      body = Immutable.fromJS(body)
      self.state = self.ledger.onWalletProperties(self.state, body)
      return self.state
    })

    this.setBraveryPropertiesCallback = sinon.stub(this.ledger, 'setBraveryPropertiesCallback').callsFake(function (error, result) {
      self.state = self.state
        .setIn(['ledger', 'info', 'created'], true)
      self.state = self.ledger.onBraveryProperties(self.state, error, result)
    })

    this.muonWriter = sinon.stub(this.ledger, 'muonWriter').callsFake(function (fileName, payload) {
      self.stateFile = JSON.stringify(payload)
    })

    this.initAccessStatePath = sinon.stub(this.ledger, 'initAccessStatePath').callsFake(function (state, statePath) {
      self.state = self.ledger.onInitReadAction(self.state, JSON.parse(self.stateFile))
      return self.state
    })

    this.onInitReadAction = sinon.stub(this.ledger, 'onInitReadAction').callsFake(function (state, parsedData) {
      self.state = self.ledger.onInitRead(self.state, parsedData)
      return self.state
    })

    this.fetchReferralHeadersCallback = sinon.stub(this.ledger, 'fetchReferralHeadersCallback').callsFake(function (err, response, body) {
      self.state = self.ledger.onFetchReferralHeaders(self.state, err, response, body)
      return self.state
    })

    this.onLedgerQRGeneratedCallback = sinon.stub(this.ledger, 'onLedgerQRGeneratedCallback').callsFake(function (index, paymentIMG) {
      self.state = self.state
        .setIn(['ledger', 'info', 'walletQR', index], paymentIMG)
    })
  }

  beforeEach (mockery) {
    this.ledger.setSynopsis(null)
  }

  after (mockery) {
    mockery.deregisterAll()
    mockery.disable()
  }

  afterEach (mockery) {
    this.setStateFile()
    this.state = defaultAppState
  }

  getInfo (state) {
    return state.getIn(['ledger', 'info'])
  }

  // To avoid snapshot inconsistencies, keeps the updateStamp constant
  modifyDateStamp () {
    this.state = this.state
      .setIn(['about', 'preferences', 'updatedStamp'], 1527108385208)
  }

  createWallet () {
    this.ledger.enable(defaultAppState)
    return this.ledger.getSynopsis()
  }

  clientInit () {
    this.state = this.ledger.init(defaultAppState)
    this.state = this.ledger.onBootStateFile(this.state)
    return this.state
  }

  corruptWallet () {
    let parsedStateFile = JSON.parse(this.stateFile)
    let seed = parsedStateFile.properties.wallet.keyinfo.seed

    if (!seed.hasOwnProperty('20') || !seed.hasOwnProperty('21')) {
      console.log('could not corrupt seed')
      return
    }

    delete seed['20']
    delete seed['21']

    parsedStateFile.properties.wallet.seed = seed
    this.ledger.muonWriter(false, parsedStateFile)

    this.state = this.state
      .setIn(['ledger', 'about', 'status'], this.ledgerStatuses.CORRUPTED_SEED)
  }

  recoverWallet (key) {
    this.clientInit()
    this.corruptWallet()
    this.state = this.ledger.recoverKeys(this.state, false, key)
    this.modifyDateStamp()
    return this.state
  }
}

module.exports = JS

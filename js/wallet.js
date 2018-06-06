/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

const Immutable = require('immutable')
const sinon = require('sinon')

const Wallet = require('../abs/wallet')
const {request, roundtrip} = require('../lib/request')
const settings = require('../browser-laptop/js/constants/settings')
const responses = require('../lib/data/responses.json')

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
    this.wallet = 'default-wallet'
    this.stateKey = 'default-state'
  }

  setStateFile () {
    const ledgerStateData = require('../lib/data/ledger-state.json')
    this.stateFile = JSON.stringify(ledgerStateData[this.stateKey])
  }

  setState (newState) {
    const oldStateJS = this.state.toJS()
    const newStateJS = newState.toJS()
    this.state = newState

    if (!newStateJS.ledger.hasOwnProperty('info')) {
      return
    }

    const newInfo = newStateJS.ledger.info

    if (!oldStateJS.ledger.hasOwnProperty('info')) {
      oldStateJS.ledger.info = {}
    }

    for (let key of Object.keys(newInfo)) {
      if (
        !newInfo.hasOwnProperty(key) ||
        (typeof newInfo[key] === 'object' &&
        Object.keys(newInfo[key]).length === 0)
      ) {
        continue
      }

      oldStateJS.ledger.info[key] = newInfo[key]
    }

    this.state = this.state
      .setIn(['ledger', 'info'], Immutable.fromJS(oldStateJS.ledger.info))
  }

  get cbResult () {
    const initialResult = Immutable.fromJS(JSON.parse(this.stateFile))
    const initialSeed = initialResult.getIn(['properties', 'wallet', 'keyinfo', 'seed'])

    const seed = this.ledger.uintKeySeed(initialSeed.toJS())
    const result = initialResult
      .setIn(['roundtrip'], this.ledger.roundtrip)
      .setIn(['properties', 'wallet', 'keyinfo', 'seed'], seed)

    return result
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

    this.resetWalletProperties = function () {
      self.wallet = 'default-wallet'
      self.stateKey = 'default-state'
      self.setStateFile()

      const stateFile = JSON.parse(self.stateFile)
      const body = Immutable.fromJS(responses['/v2/wallet/balance'][self.wallet])

      self.setState(self.ledger.onWalletProperties(self.state, body))
      self.setState(self.setInfo(self.state, 'paymentId', stateFile.properties.wallet.paymentId))
      self.setState(self.ledger.onInitRead(self.state, stateFile))
    }

    this.callback = sinon.stub(this.ledger, 'callback').callsFake(function (err, result, delayTime) {
      if (err) {
        return
      }
      if (typeof delayTime === 'undefined') {
        delayTime = Math.floor(Math.random() * (5 * 60 * 1000))
      }
      self.setState(self.ledger.onCallback(self.state, result, delayTime))
    })

    this.roundtrip = sinon.stub(this.ledger, 'roundtrip').callsFake(function (params, options, callback) {
      roundtrip(params, options, callback, self.wallet)
    })

    this.getBalance = sinon.stub(this.ledger, 'getBalance').callsFake(function (state) {
      self.setState(self.ledger.getPaymentInfo(state))
      return self.state
    })

    this.recoverWalletCallback = sinon.stub(this.ledger, 'recoverWalletCallback').callsFake(function (error, result) {
      if (error != null) {
        self.resetWalletProperties()
        return self.state
      }
      result = Immutable.fromJS(result)
      self.setState(self.ledger.onWalletRecovery(self.state, error, result))
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
      self.setState(self.ledger.onWalletProperties(self.state, body))
      return self.state
    })

    this.setBraveryPropertiesCallback = sinon.stub(this.ledger, 'setBraveryPropertiesCallback').callsFake(function (error, result) {
      self.setState(self.ledger.onBraveryProperties(self.state, error, result))
    })

    this.muonWriter = sinon.stub(this.ledger, 'muonWriter').callsFake(function (fileName, payload) {
      self.stateFile = JSON.stringify(payload)
    })

    this.initAccessStatePath = sinon.stub(this.ledger, 'initAccessStatePath').callsFake(function (state, statePath) {
      self.setState(self.ledger.onInitReadAction(self.state, JSON.parse(self.stateFile)))
      return self.state
    })

    this.onInitReadAction = sinon.stub(this.ledger, 'onInitReadAction').callsFake(function (state, parsedData) {
      self.setState(self.ledger.onInitRead(self.state, parsedData))
      return self.state
    })

    this.fetchReferralHeadersCallback = sinon.stub(this.ledger, 'fetchReferralHeadersCallback').callsFake(function (err, response, body) {
      self.setState(self.ledger.onFetchReferralHeaders(self.state, err, response, body))
      return self.state
    })

    this.qrWriteImage = sinon.stub(this.ledger, 'qrWriteImage').callsFake(function (index, url) {
      const paymentIMG = `data:image/png;base64,${Buffer.from(url).toString('base64')}`
      self.ledger.onLedgerQRGeneratedCallback(index, paymentIMG)
    })

    this.onLedgerQRGeneratedCallback = sinon.stub(this.ledger, 'onLedgerQRGeneratedCallback').callsFake(function (index, paymentIMG) {
      self.setState(self.state
        .setIn(['ledger', 'info', 'walletQR', index], paymentIMG))
    })

    this.deleteStateFile = sinon.stub(this.ledger, 'deleteStateFile').callsFake(function () {
      self.stateFile = JSON.stringify({})
    })

    this.delayFirstSync = sinon.stub(this.ledger, 'delayFirstSync').callsFake(function (parsedData) {
      self.setState(self.ledger.cacheRuleSet(self.state, parsedData.ruleset))
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
    mockery.resetCache()
    this.setStateFile()
    this.state = defaultAppState
    this.ledger.resetModules()
  }

  getInfo (state) {
    return state.getIn(['ledger', 'info'])
  }

  setInfo (state, prop, value) {
    return state.setIn(['ledger', 'info', prop], value)
  }

  // To avoid snapshot inconsistencies, keeps the updateStamp constant
  modifyDateStamp () {
    this.setState(this.state
      .setIn(['about', 'preferences', 'updatedStamp'], 1527108385208))
  }

  enable () {
    this.ledger.enable(defaultAppState)
    return this.ledger.getSynopsis()
  }

  createWallet () {
    this.setState(this.ledger.init(defaultAppState))
    this.setState(this.ledger.onBootStateFile(this.state))
    this.setState(this.ledger.onCallback(this.state, this.cbResult, -1))

    this.wallet = 'recovered-wallet'
    this.stateKey = 'recovered-state'

    return this.state
  }

  deleteWallet () {
    this.createWallet()
    this.state = this.ledger.deleteWallet(this.state)
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

    this.setState(this.state
      .setIn(['ledger', 'about', 'status'], this.ledgerStatuses.CORRUPTED_SEED))
  }

  recoverWallet (key, corrupt = false) {
    this.createWallet()
    if (corrupt) {
      this.corruptWallet()
    }
    this.ledger.recoverKeys(this.state, false, key)
    this.modifyDateStamp()
    return this.state
  }
}

module.exports = JS

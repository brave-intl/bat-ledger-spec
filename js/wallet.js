/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

const Immutable = require('immutable')
const sinon = require('sinon')

const Wallet = require('../abs/wallet')
const request = require('../lib/request')
const settings = require('../browser-laptop/js/constants/settings')

const defaultAppState = Immutable.fromJS({
  cache: {
    ledgerVideos: {}
  },
  ledger: {},
  about: {
    preferences: {}
  }
})

class JS extends Wallet {
  constructor () {
    super()
    this.state = null
    this.ledger = null
    this.minimumVisits = 1
    this.minimumVisitTime = 5000
    this.defaultContribution = 10
    this.stateFile = null
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

    this.recoverWalletCallback = sinon.stub(this.ledger, 'recoverWalletCallback').callsFake(function (error, result) {
      self.state = self.ledger.onWalletRecovery(self.state, error, result)
    })

    this.onInitReadAction = sinon.stub(this.ledger, 'onInitReadAction').callsFake(function (state, parsedData) {
      // self.state = self.ledger.onInitRead(state, parsedData)
    })

    this.getWalletPropertiesCallback = sinon.stub(this.ledger, 'getWalletPropertiesCallback').callsFake(function (err, body) {
      if (err) {
        return self.state
      }
      self.state = this.ledger.onWalletProperties(self.state, body)
      return self.state
    })

    this.onBraveryPropertiesCallback = sinon.stub(this.ledger, 'onBraveryPropertiesCallback').callsFake(function (error, result) {
      self.state = self.state
        .setIn(['ledger', 'info'], Immutable.Map())
        .setIn(['ledger', 'info', 'created'], true)
      self.state = self.ledger.onBraveryProperties(self.state, error, result)
    })

    this.onLedgerCallbackAction = sinon.stub(this.ledger, 'onLedgerCallbackAction').callsFake(function (result, delayTime) {
      self.state = self.ledger.onCallback(self.state, result, delayTime)
    })

    this.muonWriter = sinon.stub(this.ledger, 'muonWriter').callsFake(function (statePath, result) {
      self.stateFile = result
    })

    this.initAccessStatePath = sinon.stub(this.ledger, 'initAccessStatePath').callsFake(function (state, statePath) {
      self.state = self.ledger.onInitReadAction(self.stateFile)
      return state
    })

    this.extendBraveryProps = sinon.stub(this.ledger, 'extendBraveryProps').callsFake(function (bravery) {
      return {
        fee: {
          currency: 'USD',
          amount: self.defaultContribution
        }
      }
    })
  }

  beforeEach (mockery) {
    this.state = null
    this.stateFile = null
    this.ledger.setSynopsis(null)
  }

  after (mockery) {
    mockery.deregisterAll()
    mockery.disable()
  }

  createWallet () {
    this.ledger.enable(defaultAppState)
    return this.ledger.getSynopsis()
  }

  createWalletState () {
    return this.ledger.enable(defaultAppState)
  }

  setPaymentInfo (amount) {
    this.ledger.setPaymentInfo(amount)
  }

  clientInit () {
    this.state = this.ledger.init(defaultAppState)
    this.state = this.ledger.enable(this.state)
    this.state = this.ledger.onBootStateFile(this.state)
    this.setPaymentInfo(this.defaultContribution)
  }

  recoverWallet (key) {
    return this.ledger.recoverKeys(this.state, false, key)
  }
}

module.exports = JS

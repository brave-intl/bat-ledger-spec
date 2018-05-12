/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

const Immutable = require('immutable')
const sinon = require('sinon')

const Wallet = require('../abs/wallet')
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
    this.ledger = null
    this.balance = '0'
    this.currency = 'BAT'
    this.minimumVisits = 1
    this.delayTime = 50000
    this.minimumVisitTime = 5000
    this.timeStamp = 1525962147521
    this.defaultContribution = null
    this.addresses = {
      'BAT': '0x1',
      'ETH': '0x22',
      'LTC': '0x333',
      'BTC': '0x4444',
      'CARD_ID': '0x55555'
    }
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

    // browser-laptop modules
    this.ledger = require('../browser-laptop/app/browser/api/ledger')
    this.ledgerStatuses = require('../browser-laptop/app/common/constants/ledgerStatuses')

    // stubbed ledgerApi functions
    this.generatePaymentData = sinon.stub(this.ledger, 'generatePaymentData').callsFake(function (state) {
      const lookup = {
        'BAT': 'ethereum',
        'ETH': 'ethereum',
        'BTC': 'bitcoin',
        'LTC': 'litecoin'
      }
      const addresses = state.getIn(['ledger', 'info', 'addresses'])

      addresses.forEach((address, index) => {
        if (!lookup.hasOwnProperty(index)) {
          return
        }

        const img = 'data:image/png;base64,iVBORw0KGgoAAAANSUh'
        state = state
          .setIn(['ledger', 'info', 'walletQR', index], img)
      })

      return state
    })

    this.lockInContributionAmount = sinon.stub(this.ledger, 'lockInContributionAmount').callsFake(function (balance) {
      if (balance > 0) {
        if (self.defaultContribution == null) {
          self.defaultContribution = 5
        }
      }
    })

    this.recoverWalletCallback = sinon.stub(this.ledger, 'recoverWalletCallback').callsFake(function (state, error, result) {
      if (error) {
        state = state
          .setIn(['ledger', 'info', 'error'], Immutable.fromJS({
            caller: 'recoverWallet',
            error: error
          }))
        return state
      }

      state = state
        .setIn(['ledger', 'info', 'walletQR'], Immutable.Map())
        .setIn(['ledger', 'info', 'addresses'], Immutable.Map())
        .setIn(['status'], '')

      return state
    })

    this.backupOnPrint = sinon.stub(this.ledger, 'backupOnPrint').callsFake(function (state) {
      return state
        .setIn(['about', 'preferences', 'backupSucceeded'], true)
        .setIn(['about', 'preferences', 'updatedStamp'], self.timeStamp)
    })

    this.recoverKeys = sinon.stub(this.ledger, 'recoverKeys').callsFake(function (state, key) {
      let error = null

      if (typeof key !== 'string' || key !== self.walletPassphrase) {
        error = 'Invalid key'
      }

      const result = error ? null : self.walletResult
      state = self.ledger.recoverWalletCallback(state, error, result)

      if (result) {
        state = self.ledger.getStateInfo(state, result.toJS())
      }

      return state
    })
  }

  beforeEach (mockery) {
    this.ledger.setSynopsis(null)
  }

  after (mockery) {
    mockery.deregisterAll()
    mockery.disable()
  }

  get walletResult () {
    return Immutable.fromJS({
      bootStamp: 1512939627058,
      properties: {
        wallet: {
          altcurrency: 'BAT',
          keyinfo: {
            seed: this.seed
          }
        }
      }
    })
  }

  get balanceResponse () {
    return Immutable.fromJS({
      probi: '0',
      altcurrency: this.currency,
      balance: this.balance,
      parameters: {
        adFree: {
          currency: this.currency,
          fee: {
            BAT: this.defaultContribution
          }
        }
      },
      addresses: Immutable.fromJS(this.addresses)
    })
  }

  get walletPassphrase () {
    return 'wasp broken strong analyst until tray olympic arrow input bicycle gun settle prepare tissue road try sustain husband width brave section obey country area'
  }

  get seed () {
    return Buffer.from([
      32,
      87,
      30,
      26,
      223,
      56,
      224,
      31,
      213,
      136,
      248,
      95,
      136,
      56,
      250,
      78,
      179,
      121,
      255,
      162,
      195,
      39,
      143,
      136,
      18,
      140,
      49,
      216,
      221,
      154,
      78,
      173
    ])
  }

  getInfo (state) {
    return state.getIn(['ledger', 'info'])
  }

  getStatus (state) {
    return state.getIn(['status'])
  }

  getPreferences (state) {
    return state.getIn(['about', 'preferences'])
  }

  createWallet () {
    this.ledger.enable(defaultAppState)
    return this.ledger.getSynopsis()
  }

  // Like create wallet, except the state is returned
  createWalletState () {
    return this.ledger.enable(defaultAppState)
  }

  corruptWallet (state) {
    return state.setIn(['status'], this.ledgerStatuses.CORRUPTED_SEED)
  }

  backupWallet () {
    const state = this.createWalletState()
    return this.ledger.backupKeys(state, 'print')
  }

  recoverWallet (key) {
    const state = this.createWalletState()
    const corruptedState = this.corruptWallet(state)
    return this.ledger.recoverKeys(corruptedState, key)
  }

  setWalletProperties (props = {}) {
    let body = this.balanceResponse

    Object.keys(props).forEach((key) => {
      if (body.get(key)) {
        body = body.setIn([key], props[key])
      }
    })

    const state = this.createWalletState()
    const result = this.ledger.onWalletProperties(state, body)
    return this.ledger.getStateInfo(result, this.walletResult.toJS())
  }
}

module.exports = JS

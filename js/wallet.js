/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

const Immutable = require('immutable')
const sinon = require('sinon')

const Wallet = require('../abs/wallet')

const defaultAppState = Immutable.fromJS({
  cache: {
    ledgerVideos: {}
  },
  ledger: {}
})

class JS extends Wallet {
  constructor () {
    super()
    this.ledger = null
    this.balance = '500.00'
  }

  before (mockery) {
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

    this.ledger = require('../browser-laptop/app/browser/api/ledger')
    this.ledgerStatuses = require('../browser-laptop/app/common/constants/ledgerStatuses')
    this.recoverKeys = sinon.stub(this.ledger, 'recoverKeys').callsFake(function (state, key) {
      if (typeof key !== 'string') {
        return state.setIn(['about', 'preferences', 'recoverySucceeded'], false)
      }

      return state
        .setIn(['status'], '')
        .setIn(['about', 'preferences', 'recoverySucceeded'], true)
    })
  }

  beforeEach (mockery) {
    this.ledger.setSynopsis(null)
  }

  after (mockery) {
    mockery.deregisterAll()
    mockery.disable()
  }

  get balanceResponse () {
    return Immutable.fromJS({
      probi: '0',
      addresses: [],
      altcurrency: 'BAT',
      balance: this.balance,
      parameters: {
        adFree: {
          currency: 'BAT',
          fee: {
            BAT: 10
          }
        }
      }
    })
  }

  createWallet () {
    this.ledger.enable(defaultAppState)
    return this.ledger.getSynopsis()
  }

  corruptWallet () {
    const state = this.ledger.enable(defaultAppState)
    return state.setIn(['status'], this.ledgerStatuses.CORRUPTED_SEED)
  }

  recoverWallet (state, key) {
    const result = this.recoverKeys(state, key)
    const status = result.getIn(['status'])
    const recoverySucceeded = result.getIn(['about', 'preferences', 'recoverySucceeded'])
    return status === '' && recoverySucceeded
  }

  setWalletProperties (props = {}) {
    let body = this.balanceResponse

    Object.keys(props).forEach((key) => {
      if (body.get(key)) {
        body = body.setIn([key], props[key])
      }
    })

    const state = this.ledger.enable(defaultAppState)
    return this.ledger.onWalletProperties(state, body)
  }
}

module.exports = JS

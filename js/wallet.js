/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

const Immutable = require('immutable')

const Wallet = require('../abs/wallet')
const responses = require('../lib/data/responses.json')
const ledgerStateData = require('../lib/data/ledger-state.json')

class JS extends Wallet {
  constructor () {
    super()
    this.wallet = 'default-wallet'
    this.stateKey = 'default-state'
    this.stateFile = null
  }

  setStateFile () {
    this.stateFile = JSON.stringify(ledgerStateData[this.stateKey])
  }

  fallbackToPrevWallet () {
    this.wallet = 'default-wallet'
    this.stateKey = 'default-state'
    this.setStateFile()

    const stateFile = JSON.parse(this.stateFile)
    const body = Immutable.fromJS(responses['/v2/wallet/balance'][this.wallet])

    this.setState(this.ledger.onWalletProperties(this.state, body))
    this.setState(this.setInfo(this.state, 'paymentId', stateFile.properties.wallet.paymentId))
    this.setState(this.ledger.onInitRead(this.state, stateFile))
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

  runBefore (mockery) {
    this.before(mockery)
    this.setStateFile()
    this.ledger = require('../browser-laptop/app/browser/api/ledger')
    this.ledgerStatuses = require('../browser-laptop/app/common/constants/ledgerStatuses')
    this.loadStubs(['wallet'])
  }

  runAfterEach (mockery) {
    this.afterEach(mockery)
    this.setStateFile()
  }

  // To avoid snapshot inconsistencies, keeps the updateStamp constant
  modifyDateStamp () {
    this.setState(this.state
      .setIn(['about', 'preferences', 'updatedStamp'], 1527108385208))
  }

  enable () {
    this.ledger.enable(this.defaultAppState)
    return this.ledger.getSynopsis()
  }

  createWallet () {
    this.setState(this.ledger.init(this.defaultAppState))
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

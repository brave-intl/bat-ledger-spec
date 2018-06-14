/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

const Immutable = require('immutable')

const Wallet = require('../abs/wallet')
const {request} = require('../lib/util/request')
const settings = require('../browser-laptop/js/constants/settings')
const responses = require('../lib/data/responses.json')
const ledgerStateData = require('../lib/data/ledger-state.json')

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
    this.wallet = 'default-wallet'
    this.stateKey = 'default-state'
    this.state = defaultAppState
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

  get settingsP () {
    return {
      PAYMENTS_MINIMUM_VISITS: 1,
      PAYMENTS_MINIMUM_VISIT_TIME: 8000,
      PAYMENTS_CONTRIBUTION_AMOUNT: 10,
      PAYMENTS_ENABLED: true,
      PAYMENTS_NOTIFICATION_TRY_PAYMENTS_DISMISSED: true
    }
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
        const keyP = Object.keys(settings).find((k) => settings[k] === key)
        if (this.settingsP.hasOwnProperty(keyP)) {
          return self.settingsP[keyP]
        }
      }
    })

    this.setStateFile()
    this.ledger = require('../browser-laptop/app/browser/api/ledger')
    this.ledgerStatuses = require('../browser-laptop/app/common/constants/ledgerStatuses')
    this.loadStubs(['wallet'])
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

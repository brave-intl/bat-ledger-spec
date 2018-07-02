/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

const Lib = require('../abs/index')
const Immutable = require('immutable')
const sinon = require('sinon')
const stubs = require('../lib/helpers/stubs')
const {request} = require('../lib/util/request')
const settings = require('../browser-laptop/js/constants/settings')

class Spec extends Lib {
  constructor () {
    super()
    this.defaultSettings = {
      PAYMENTS_MINIMUM_VISITS: 1,
      PAYMENTS_MINIMUM_VISIT_TIME: 8000,
      PAYMENTS_CONTRIBUTION_AMOUNT: 10,
      PAYMENTS_ENABLED: true,
      PAYMENTS_NOTIFICATION_TRY_PAYMENTS_DISMISSED: true,
      PAYMENTS_SITES_AUTO_SUGGEST: true
    }
    this.defaultAppState = Immutable.fromJS({
      cache: {
        ledgerVideos: {}
      },
      ledger: {
        about: {}
      },
      about: {
        preferences: {}
      },
      tabs: [],
      windows: [{
        focused: true,
        windowId: -1
      }]
    })
    this.ledger = null
    this.state = this.defaultAppState
    this.settings = this.assign(this.defaultSettings)
  }

  before (mockery) {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    })

    sinon.useFakeTimers()

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
        if (this.settings.hasOwnProperty(keyP)) {
          return this.settings[keyP]
        }
      }
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
    this.state = this.defaultAppState
    this.ledger.resetModules()
    this.settings = this.assign(this.defaultSettings)
  }

  assign (obj) {
    return Object.assign({}, obj)
  }

  changeSetting (prop, value) {
    if (this.settings.hasOwnProperty(prop)) {
      this.settings[prop] = value
    }
  }

  getInfo (state) {
    return state.getIn(['ledger', 'info'])
  }

  setInfo (state, prop, value) {
    return state.setIn(['ledger', 'info', prop], value)
  }

  loadStubs (keys) {
    keys.forEach((key) => {
      stubs[key].forEach((stub) => {
        let args = [null, this]
        if (stub.bindOriginal) {
          args.push(this.ledger[stub.name])
        }
        sinon.stub(this.ledger, stub.name).callsFake(stub.func.bind(...args))
      })
    })
  }

  setState (newState) {
    let oldState = this.state
    this.state = newState

    if (!newState.hasIn(['ledger', 'info'])) {
      return
    }

    if (!oldState.hasIn(['ledger', 'info'])) {
      oldState = oldState.setIn(['ledger', 'info'], Immutable.Map())
    }

    const newInfo = newState.getIn(['ledger', 'info'])

    newInfo.keySeq().forEach((key) => {
      const temp = newInfo.getIn([key])

      if (Immutable.Map.isMap(temp) && temp.size === 0) {
        return
      }

      oldState = oldState.setIn(['ledger', 'info', key], temp)
    })

    this.state = this.state
      .setIn(['ledger', 'info'], oldState.getIn(['ledger', 'info']))
  }
}

module.exports = Spec

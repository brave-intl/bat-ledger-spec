/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

const Immutable = require('immutable')
const sinon = require('sinon')

const Publisher = require('../abs/publisher')
const {request} = require('../lib/util/request')
const settings = require('../browser-laptop/js/constants/settings')
const stubs = require('../lib/helpers/stubs')

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

class JS extends Publisher {
  constructor () {
    super()
    this.ledger = null
    this.timeStamp = 1525688397657
    this.state = defaultAppState
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

  setState (newState) {
    let oldState = this.state
    this.state = newState

    if (!newState.get('ledger').hasIn(['info'])) {
      return
    }

    if (!oldState.get('ledger').hasIn(['info'])) {
      oldState = oldState.setIn(['ledger', 'info'], Immutable.Map())
    }

    const newInfo = newState.getIn(['ledger', 'info'])

    newInfo.keySeq().forEach((key) => {
      const temp = newInfo.getIn([key])

      if (Immutable.Map.isMap(temp) &&
         Object.keys(temp.toJS()).length === 0) {
        return
      }

      oldState = oldState.setIn(['ledger', 'info', key], temp)
    })

    this.state = this.state
      .setIn(['ledger', 'info'], oldState.getIn(['ledger', 'info']))
  }

  loadStubs () {
    ['wallet', 'publisher'].forEach((key) => {
      stubs[key].forEach((stub) => {
        sinon.stub(this.ledger, stub.name).callsFake(stub.func.bind(null, this))
      })
    })
  }

  before (mockery) {
    const self = this
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    })
    this.fakeClock = sinon.useFakeTimers()

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

    this.ledger = require('../browser-laptop/app/browser/api/ledger')
    this.loadStubs()
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
    this.state = defaultAppState
    this.ledger.resetModules()
  }

  addPublisher (publisher) {
    this.state = this.ledger.enable(defaultAppState)

    const publisherTabId = publisher.tabId
    const publisherKey = publisher.publisherKey
    const publisherUrl = `${publisher.url}/`

    this.state = this.state
      .setIn(['pageData', 'info', publisherUrl], Immutable.fromJS({
        key: publisherUrl,
        protocol: 'https:',
        publisher: publisherKey,
        timestamp: this.timeStamp,
        url: publisherUrl
      }))
      .setIn(['pageData', 'last'], Immutable.fromJS({
        info: publisherUrl,
        tabId: publisherTabId
      }))
      .setIn(['ledger', 'locations', publisherUrl], Immutable.fromJS({
        publisher: publisherKey
      }))

    this.state = this.ledger.pageDataChanged(this.state, {
      location: publisherUrl,
      tabId: publisherTabId
    })

    return this.ledger.getSynopsis()
  }
}

module.exports = JS

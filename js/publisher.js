/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

const Immutable = require('immutable')
const sinon = require('sinon')

const Publisher = require('../abs/publisher')
const {request} = require('../lib/util/request')
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
  },
  tabs: []
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
    this.loadStubs(['publisher'])
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

  initSynopsis () {
    this.state = this.ledger.enable(defaultAppState)
    return this.ledger.getSynopsis()
  }

  addPublisher (publisher, manual = false) {
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

    if (manual) {
      this.state = this.ledger.addNewLocation(this.state, publisherUrl, publisherTabId, false, true)
    }

    this.state = this.ledger.pageDataChanged(this.state, {
      location: publisherUrl,
      tabId: publisherTabId
    })

    return this.ledger.getSynopsis()
  }
}

module.exports = JS

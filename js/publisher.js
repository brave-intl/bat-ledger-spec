/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

const Immutable = require('immutable')
const sinon = require('sinon')

const Publisher = require('../abs/publisher')
const settings = require('../browser-laptop/js/constants/settings')

const defaultAppState = Immutable.fromJS({
  cache: {
    ledgerVideos: {}
  },
  ledger: {}
})

class JS extends Publisher {
  constructor () {
    super()
    this.ledger = null
    this.paymentEnabled = false
    this.paymentAutoSuggest = true
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
          case settings.PAYMENTS_MINIMUM_VISIT_TIME:
          {
            return 8000
          }
          case settings.PAYMENTS_MINIMUM_VISITS:
          {
            return 1
          }
          case settings.PAYMENTS_ENABLED:
          {
            return self.paymentEnabled
          }
          case settings.PAYMENTS_SITES_AUTO_SUGGEST:
          {
            return self.paymentAutoSuggest
          }
        }
      }
    })

    this.ledger = require('../browser-laptop/app/browser/api/ledger')

    this.fetchFavIcon = sinon.stub(this.ledger, 'fetchFavIcon').callsFake(function () {
      return 'data:image/x-icon;base64,AAABAAMAQEAAAA'
    })
  }

  beforeEach (mockery) {
    this.ledger.setSynopsis(null)
    this.paymentEnabled = false
  }

  after (mockery) {
    mockery.deregisterAll()
    mockery.disable()

    if (this.fetchFavIcon) {
      this.fetchFavIcon.restore()
    }
  }

  afterEach (mockery) {
    if (this.fetchFavIcon) {
      this.fetchFavIcon.reset()
    }
  }

  addSite (publisher, exist = true) {
    let state = this.ledger.enable(defaultAppState)
    this.paymentEnabled = true
    const publisherKey = publisher.publisherKey
    const url = `https://${publisherKey}/`

    state = state
      .setIn(['pageData', 'info', url], Immutable.fromJS({
        key: url,
        protocol: 'https:',
        publisher: publisherKey,
        timestamp: 1525688389657,
        url: url
      }))
      .setIn(['pageData', 'last'], Immutable.fromJS({
        info: url,
        tabId: publisher.tabId
      }))
      .setIn(['ledger', 'locations', url], Immutable.fromJS({
        publisher: publisherKey
      }))

    state = this.ledger.pageDataChanged(state, {
      location: `https://${publisherKey}`,
      tabId: publisher.tabId
    })
    console.log(JSON.stringify(state.toJS()))
    return this.ledger.getSynopsis()
  }

  addMedia () {
    // this.ledger.enable(defaultAppState)
    return this.ledger.getSynopsis()
  }

  manuallyAddSite (publisher) {
    return this.ledger.getSynopsis()
  }
}

module.exports = JS

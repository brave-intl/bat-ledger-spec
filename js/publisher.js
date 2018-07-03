/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

const Immutable = require('immutable')

const Publisher = require('../abs/publisher')
const ledgerState = require('../browser-laptop/app/common/state/ledgerState')
const responses = require('../lib/data/responses.json')

class JS extends Publisher {
  constructor () {
    super()
    this.timeStamp = 1525688397657
    this.mediaType = null
    this.mediaMinimum = null
    this.currentVisitTime = null
    this.activeWindowId = 25
  }

  runBefore (mockery) {
    this.before(mockery)
    this.ledger = require('../browser-laptop/app/browser/api/ledger')
    this.loadStubs(['publisher'])
  }

  runBeforeEach (mockery) {
    this.beforeEach(mockery)
    this.changeSetting('PAYMENTS_ALLOW_NON_VERIFIED', false)
  }

  runAfterEach (mockery) {
    this.afterEach(mockery)
    this.currentVisitTime = null
    this.ledger.resetCurrentUrl()
  }

  initSynopsis () {
    this.state = this.ledger.enable(this.defaultAppState)
  }

  deleteSynopsis () {
    this.state = ledgerState.deleteSynopsis(this.state)
    return this.state.get('ledger')
  }

  setActiveTab (tabId) {
    this.state = this.state
      .setIn(['tabs'], Immutable.fromJS([{
        'active': true,
        'windowId': this.activeWindowId,
        'tabId': tabId
      }]))
  }

  incTabId (pub) {
    const publisher = Object.assign({tabId: pub.tabId++}, pub)
    return publisher
  }

  get mediaRequest () {
    return responses['media'][this.mediaType]['media-request'][this.mediaMinimum]
  }

  get synopsis () {
    return this.ledger.getSynopsis()
  }

  setLocationData (publisher) {
    return this.state
      .setIn(['pageData', 'info', publisher.url], Immutable.fromJS({
        key: publisher.url,
        protocol: 'https:',
        publisher: publisher.key,
        timestamp: this.timeStamp,
        url: publisher.url
      }))
      .setIn(['pageData', 'last'], Immutable.fromJS({
        info: publisher.url,
        tabId: publisher.tabId
      }))
      .setIn(['ledger', 'locations', publisher.url], Immutable.fromJS({
        publisher: publisher.key
      }))
  }

  manualAddPublisher (publisher, enableSynopsis = true) {
    if (enableSynopsis) {
      this.initSynopsis()
    }

    this.setState(this.setLocationData(publisher))
    this.setState(this.ledger.addNewLocation(this.state, publisher.url, publisher.tabId, false, true))
    this.setState(this.ledger.pageDataChanged(this.state, {
      location: publisher.url,
      tabId: publisher.tabId
    }))
  }

  addPublisherVisit (publisher, enableSynopsis = true) {
    if (enableSynopsis) {
      this.initSynopsis()
    }

    this.currentVisitTime = publisher.visitTime
    this.setState(this.setLocationData(publisher))
    this.setState(this.ledger.pageDataChanged(this.state, {
      location: publisher.url,
      tabId: publisher.tabId
    }))
    this.setState(this.ledger.pageDataChanged(this.state, {}, true))
  }

  deletePublisher (publisherKey) {
    this.ledger.deleteSynopsisPublisher(publisherKey)
    this.setState(ledgerState.deletePublishers(this.state, publisherKey))
    this.setState(this.ledger.updatePublisherInfo(this.state, publisherKey))
  }

  pinPublisher (publisherKey, percentage, pinned = true) {
    const newPercentage = pinned ? percentage : 0
    const publisher = ledgerState.getPublisher(this.state, publisherKey)

    if (publisher.isEmpty()) {
      return
    }

    this.setState(this.ledger.updatePublisherInfo(this.state))
    this.setState(ledgerState.setPublishersProp(this.state, publisherKey, 'pinPercentage', newPercentage))

    this.ledger.savePublisherData(publisherKey, 'pinPercentage', newPercentage)
    this.setState(this.ledger.updatePublisherInfo(this.state, publisherKey))
  }

  processTwitchData (key, xhr, type, details) {
    const twitchUploadData = require('../lib/data/twitchUploadData.json').upload_data[key]

    twitchUploadData.forEach((piece) => {
      let uploadData = []

      if (!Array.isArray(piece)) {
        piece.data.forEach((data) => {
          uploadData.push({
            'bytes': Buffer.from(data)
          })
        })
      } else {
        uploadData = [{'bytes': Buffer.from(piece)}]
      }

      details.uploadData = uploadData
      this.setState(this.ledger.onMediaRequest(this.state, xhr, type, Immutable.fromJS(details)))
    })
  }

  invokeMediaRequest (type, min = false, key = false) {
    this.mediaType = type
    this.mediaMinimum = min ? 'min' : 'non'
    this.state = this.ledger.enable(this.defaultAppState)

    const xhr = this.mediaRequest.xhr
    const details = this.mediaRequest.details
    const immutableDetails = Immutable.fromJS(details)
    this.setActiveTab(immutableDetails.get('tabId'))

    if (type === 'twitch') {
      this.processTwitchData(key, xhr, type, details)
      return
    }

    this.setState(this.ledger.onMediaRequest(this.state, xhr, type, immutableDetails))
  }
}

module.exports = JS

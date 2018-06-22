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
  }

  runBefore (mockery) {
    this.before(mockery)
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
    this.state = this.defaultAppState
    this.ledger.resetModules()
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
        'windowId': 25,
        'tabId': tabId
      }]))
  }

  get mediaRequest () {
    return responses['media'][this.mediaType]['media-request'][this.mediaMinimum]
  }

  get synopsis () {
    return this.ledger.getSynopsis()
  }

  addPublisher (publisher, enableSynopsis = true) {
    if (enableSynopsis) {
      this.state = this.ledger.enable(this.defaultAppState)
    }

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

    this.setState(this.ledger.addNewLocation(this.state, publisherUrl, publisherTabId, false, true))

    this.setState(this.ledger.pageDataChanged(this.state, {
      location: publisherUrl,
      tabId: publisherTabId
    }))
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

  processTwitchData (xhr, type, details) {
    const twitchUploadData = responses['media']['twitch']['upload-data']
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

  invokeMediaRequest (type, min = false) {
    this.mediaType = type
    this.mediaMinimum = min ? 'min' : 'non'
    this.state = this.ledger.enable(this.defaultAppState)

    const xhr = this.mediaRequest.xhr
    const details = Immutable.fromJS(this.mediaRequest.details)
    this.setActiveTab(details.get('tabId'))

    if (type === 'twitch') {
      this.processTwitchData(xhr, type, details.toJS())
      return
    }

    this.setState(this.ledger.onMediaRequest(this.state, xhr, type, Immutable.fromJS(details)))
  }
}

module.exports = JS

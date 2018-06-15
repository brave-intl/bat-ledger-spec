/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'
const Immutable = require('immutable')
const {roundtrip} = require('../util/request')
const responses = require('../data/responses')

module.exports = {
  wallet: [
    {
      name: 'callback',
      func: function (self, err, result, delayTime) {
        if (err) {
          return
        }
        if (typeof delayTime === 'undefined') {
          delayTime = Math.floor(Math.random() * (5 * 60 * 1000))
        }
        self.setState(self.ledger.onCallback(self.state, result, delayTime))
      }
    },
    {
      name: 'roundtrip',
      func: function (self, params, options, callback) {
        roundtrip(params, options, callback, self.wallet)
      }
    },
    {
      name: 'getBalance',
      func: function (self, state) {
        self.setState(self.ledger.getPaymentInfo(state))
        return self.state
      }
    },
    {
      name: 'recoverWalletCallback',
      func: function (self, error, result) {
        if (error != null) {
          self.fallbackToPrevWallet()
          return self.state
        }
        result = Immutable.fromJS(result)
        self.setState(self.ledger.onWalletRecovery(self.state, error, result))
      }
    },
    {
      name: 'publisherTimestampCallback',
      func: function (self, err, result) {
        if (err) {
          return self.state
        }
        self.ledger.onPublisherTimestamp(self.state, result.timestamp, false)
      }
    },
    {
      name: 'getWalletPropertiesCallback',
      func: function (self, err, body) {
        if (err) {
          return self.state
        }
        body = Immutable.fromJS(body)
        self.setState(self.ledger.onWalletProperties(self.state, body))
        return self.state
      }
    },
    {
      name: 'setBraveryPropertiesCallback',
      func: function (self, error, result) {
        self.setState(self.ledger.onBraveryProperties(self.state, error, result))
      }
    },
    {
      name: 'muonWriter',
      func: function (self, fileName, payload) {
        self.stateFile = JSON.stringify(payload)
      }
    },
    {
      name: 'initAccessStatePath',
      func: function (self, state, statePath) {
        self.setState(self.ledger.onInitReadAction(self.state, JSON.parse(self.stateFile)))
        return self.state
      }
    },
    {
      name: 'onInitReadAction',
      func: function (self, state, parsedData) {
        self.setState(self.ledger.onInitRead(self.state, parsedData))
        return self.state
      }
    },
    {
      name: 'fetchReferralHeadersCallback',
      func: function (self, err, response, body) {
        self.setState(self.ledger.onFetchReferralHeaders(self.state, err, response, body))
        return self.state
      }
    },
    {
      name: 'qrWriteImage',
      func: function (self, index, url) {
        const paymentIMG = `data:image/png;base64,${Buffer.from(url).toString('base64')}`
        self.ledger.onLedgerQRGeneratedCallback(index, paymentIMG)
      }
    },
    {
      name: 'onLedgerQRGeneratedCallback',
      func: function (self, index, paymentIMG) {
        self.setState(self.state
          .setIn(['ledger', 'info', 'walletQR', index], paymentIMG))
      }
    },
    {
      name: 'deleteStateFile',
      func: function (self) {
        self.stateFile = JSON.stringify({})
      }
    },
    {
      name: 'delayFirstSync',
      func: function (self, parsedData) {
        self.setState(self.ledger.cacheRuleSet(self.state, parsedData.ruleset))
      }
    }
  ],
  publisher: [
    {
      name: 'getFavIcon',
      func: function (self, state, publisherKey, page) {
        const favIcon = `data:image/png;base64,${Buffer.from(publisherKey).toString('base64')}`
        self.state = self.ledger.onFavIconReceived(self.state, publisherKey, favIcon)
        self.state = self.ledger.updatePublisherInfo(self.state)
        return self.state
      }
    },
    {
      name: 'setTestMinimums',
      func: function (self, state) {
        const synopsis = self.ledger.getSynopsis()
        const minVisits = self.settingsP.PAYMENTS_MINIMUM_VISITS
        const minDuration = self.settingsP.PAYMENTS_MINIMUM_VISIT_TIME

        synopsis.options.minPublisherVisits = minVisits
        synopsis.options.minPublisherDuration = minDuration

        self.state = self.state.setIn(['ledger', 'synopsis', 'options', 'minPublisherVisits'], minVisits)
        self.state = self.state.setIn(['ledger', 'synopsis', 'options', 'minPublisherDuration'], minDuration)
        return self.state
      }
    },
    // This is temporary until tab ops are integrated in to the spec
    {
      name: 'shouldTrackTab',
      func: function (self, state, tabId) {
        return true
      }
    },
    {
      name: 'getPublisherFromPropsAction',
      func: function (self, mediaProps, options, mediaKey, duration, revisited) {
        const response = Immutable.fromJS(responses['media'][self.mediaType]['media-publisher'])
        self.setState(self.ledger.onMediaPublisher(self.state, mediaKey, response, duration, revisited))
      }
    }
  ]
}

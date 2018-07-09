/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this file,
* You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

const clientHelper = require('../lib/helpers/clientHelper')
const Contribution = require('../abs/contribution')
const ledgerState = require('../browser-laptop/app/common/state/ledgerState')
const ledgerStateData = require('../lib/data/ledger-state-funded.json')
const ledgerStateOriginalData = require('../lib/data/ledger-state.json')
const reconcileResponses = require('../lib/data/contribution-responses')
const sinon = require('sinon')
const now = new Date()
const underscore = require('underscore')
const Immutable = require('immutable')
const msecs = {
  minute: 1000 * 60
}

class JS extends Contribution {
  constructor () {
    super()
    this.funding = 'sufficientFunds'
  }

  runBefore (mockery) {
    this.before(mockery)
    process.env.LEDGER_ENVIRONMENT = 'staging'
    process.env.LEDGER_NO_DELAY = true
  }

  beforeEach () {
    this.funding = 'sufficientFunds'
    sinon.useFakeTimers(now.getTime())
    this.setStateFile()
    this.ledgerStatuses = require('../browser-laptop/app/common/constants/ledgerStatuses')
    this.ledger = require('../browser-laptop/app/browser/api/ledger')
    this.loadStubs(['contribution'])
    this.ledger.setSynopsis(null)
  }

  after (mockery) {
    mockery.deregisterAll()
    mockery.disable()
  }

  afterEach (mockery) {
    mockery.resetCache()
    this.resetStateFile()
    this.ledger.setClient(null)
    this.state = this.defaultAppState
    if (this.ledger.getBreakRun()) {
      this.ledger.setBreakRun(false)
    }
    this.ledger = null
    this.paymentsContributionAmount = 10
  }

  clientSetup (reconcileStamp) {
    this.client = this.ledger.getClient()
    this.client.state.reconcileStamp = reconcileStamp
    this.client.credentials = {
      persona: {
        parameters: {
          userId: '65ba48f6-591b-437c-ae74-219c8c5d4921'
        }
      }
    }
    const fCredential = reconcileResponses['reconcileCredentialFinalizeResponse']
    const fPayload = reconcileResponses['reconcileCredentialSubmitResponse']
    if (!this.client.credentialFinalize) {
      this.client.credentialFinalize = sinon.stub(this.client, 'credentialFinalize').callsFake(function (credential, verification, callback) {
        callback(null, fCredential)
      })
    }
    this.client.credentialSubmit = sinon.stub(this.client, 'credentialSubmit').callsFake(function (ballots, callback) {
      callback(null, fPayload)
    })
    this.ledger.setClient(this.client)
  }

  setStateFile () {
    this.stateFile = JSON.stringify(ledgerStateData)
  }

  resetStateFile () {
    this.stateFile = JSON.stringify(ledgerStateOriginalData)
  }

  addPublishersToLedger () {
    this.addPublisherToLedger('https://clifton.io', 1)
    this.addPublisherToLedger('https://brianbondy.com', 2)
    this.addPublisherToLedger('https://bumpsmack.com', 3)
  }

  addPublisherToLedger (location, tabId = true) {
    this.setState(this.ledger.addNewLocation(this.state, location, tabId, false, true))
    this.setState(this.ledger.pageDataChanged(this.state, {}, true))
  }

  fuzzPublishers () {
    let synopsis = this.ledger.getSynopsis()
    underscore.keys(synopsis.publishers).forEach((publisher) => {
      synopsis.publishers[publisher].duration = synopsis.publishers[publisher].window[0].duration = 15 * msecs.minute
      synopsis.publishers[publisher].faviconURL = ''
      synopsis.publishers[publisher].protocol = ''
    })
    this.ledger.setSynopsis(synopsis)
    this.state = this.state.setIn(['ledger', 'synopsis', 'publishers'], Immutable.fromJS(synopsis.publishers))
  }

  initWallet () {
    this.setState(clientHelper.clientInit(this.ledger, this.state))
    this.ledger.setBreakRun(true)
    this.setState(clientHelper.clientBoot(this.ledger, this.state, this.ledger.getClient()))
    this.ledger.setBreakRun(false)
  }

  createWallet () {
    this.setState(this.ledger.enable(this.state))
  }

  contributionBeforeTime () {
    this.initWallet()
    this.clientSetup(1719633600000)
    this.addPublishersToLedger()
    this.fuzzPublishers()
    this.state = ledgerState.setInfoProp(this.state, 'reconcileStamp', 1719633600000) // 06/29/2024
    this.ledger.run(this.state, 0)
    return this.getInfo(this.state) || {}
  }

  contributionMinusFunds () {
    this.funding = 'insufficientFunds'
    this.initWallet()
    this.clientSetup(1528948800000)
    this.addPublishersToLedger()
    this.fuzzPublishers()
    this.state = ledgerState.setInfoProp(this.state, 'reconcileStamp', 1528948800000)
    this.ledger.run(this.state, 0)
    return this.getInfo(this.state) || {}
  }

  contributionAdequateFundsReqMet () {
    this.initWallet()
    this.clientSetup(1528948800000)
    this.addPublishersToLedger()
    this.fuzzPublishers()
    this.state = ledgerState.setInfoProp(this.state, 'reconcileStamp', 1528948800000)
    this.ledger.run(this.state, 0)
    return this.getInfo(this.state) || {}
  }

  contributionAdequateFundsReqNotMet () {
    this.initWallet()
    this.clientSetup(1528948800000)
    this.addPublishersToLedger()
    this.state = ledgerState.setInfoProp(this.state, 'reconcileStamp', 1528948800000)
    this.ledger.run(this.state, 0)
    return this.getInfo(this.state) || {}
  }
}

module.exports = JS

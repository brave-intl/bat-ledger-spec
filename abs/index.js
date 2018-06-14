/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

const Immutable = require('immutable')
const sinon = require('sinon')
const stubs = require('../lib/helpers/stubs')

class Lib {
  before () {
    throw new Error('Function before is missing!')
  }

  beforeEach () {
    throw new Error('Function beforeEach is missing!')
  }

  after () {
    throw new Error('Function after is missing!')
  }

  afterEach () {
    throw new Error('Function afterEach is missing!')
  }

  loadStubs (keys) {
    keys.forEach((key) => {
      stubs[key].forEach((stub) => {
        sinon.stub(this.ledger, stub.name).callsFake(stub.func.bind(null, this))
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

      if (Immutable.Map.isMap(temp) &&
         Object.keys(temp.toJS()).length === 0) {
        return
      }

      oldState = oldState.setIn(['ledger', 'info', key], temp)
    })

    this.state = this.state
      .setIn(['ledger', 'info'], oldState.getIn(['ledger', 'info']))
  }
}

module.exports = Lib

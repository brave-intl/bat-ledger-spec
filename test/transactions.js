/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this file,
* You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

/* global describe, before, beforeEach, after, afterEach, it */

// const assert = require('assert')
const helper = require('../helper')
/* const snapshot = ommitted for now for lint */ require('snap-shot-it')
const mockery = require('mockery')

const lib = helper.getLib()

describe('transaction', function () {
  before(function () {
    lib.before(mockery)
  })

  beforeEach(function () {
    lib.beforeEach(mockery)
  })

  after(function () {
    lib.after(mockery)
  })

  afterEach(function () {
    lib.afterEach(mockery)
  })

  it('Gets transaction in JSON format', function () {

  })

  it('Observes transactions and reports the status to the state', function () {

  })

  it('Sets a transactions viewing ID', function () {

  })

  it('Sets a transactions surveyor ID', function () {

  })

  it('Sets the transactions contribution fiat amount', function () {

  })

  it('Sets the transactions contribution fiat currency', function () {

  })

  it('Sets the transactions contribution rate', function () {

  })

  it('Sets the transactions contribution alternate currency', function () {

  })

  it('Sets the transactions contribution fee', function () {

  })

  it('Sets the transactions submission timestamp', function () {

  })

  it('Sets the transactions submission ID', function () {

  })

  it('Gets the current exchange rates based on `from` and `to` currency', function () {

  })

  it('Sets the transactions to the state', function () {

  })

  it('Reads the transactions from the state', function () {

  })

  it('Gets a transactions viewing ID', function () {

  })

  it('Gets a transactions surveyor ID', function () {

  })

  it('Gets the transactions contribution fiat amount', function () {

  })

  it('Gets the transactions contribution fiat currency', function () {

  })

  it('Gets the transactions contribution rate', function () {

  })

  it('Gets the transactions contribution alternate currency', function () {

  })

  it('Gets the transactions contribution fee', function () {

  })

  it('Gets the transactions submission timestamp', function () {

  })

  it('Gets the transactions submission ID', function () {

  })

  it('Reads transactions and produces a CSV contribution breakdown', function () {

  })
})

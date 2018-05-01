/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this file,
* You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

/* global describe, before, beforeEach, after, it */

// const assert = require('assert')
const helper = require('../helper')
/* const snapshot = ommitted for now for lint */ require('snap-shot-it')
const mockery = require('mockery')

const lib = helper.getLib()

describe('contribution', function () {
  before(function () {
    lib.before(mockery)
  })

  beforeEach(function () {
    lib.beforeEach(mockery)
  })

  after(function () {
    lib.after(mockery)
  })

  it('Get the contribution amount', function () {

  })

  it('Set the contribution amount', function () {

  })

  it('Lock in the contribution amount', function () {

  })

  it('Sets the time until the next reconciliation', function () {

  })

  it('After time to reconcile has been set', function () {

  })

  it('Checks to see if ready for reconciliation', function () {

  })

  it('Performs reconciliation', function () {

  })

  it('Checks for how much time until reconciliation', function () {

  })

  it('Checks for sufficient balance for reconciliation', function () {

  })

  it('Wallet has a reconcile timestamp', function () {

  })

  it('Gets the last reconcile date', function () {

  })

  it('Gets the next reconcile date', function () {

  })

  it('Gets last reconcile message', function () {

  })

  it('Gets the total contribution amount from a transaction', function () {

  })
})

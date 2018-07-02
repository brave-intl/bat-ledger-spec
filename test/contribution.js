/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

/* global describe, before, beforeEach, after, afterEach, it */

const helper = require('../helper')
const snapshot = require('snap-shot-it')
const mockery = require('mockery')

const lib = helper.getLib('contribution')

describe('contribution (contribution tests run for approximately 15 seconds)', function () {
  before(function () {
    lib.runBefore(mockery)
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

  it('Tries to run contribution before time to reconcile', async function () {
    const result = lib.contributionBeforeTime()
    snapshot(this.test.fullTitle(), result)
  })

  it('Tries to run contribution at reconcile with enough funds and met browsing requirements', function () {
    const result = lib.contributionAdequateFundsReqMet()
    snapshot(this.test.fullTitle(), result)
  })

  it.skip('Tries to run contribution at reconcile with not enough funds', function () {
    const result = lib.contributionMinusFunds()
    snapshot(this.test.fullTitle(), result)
  })

  it.skip('Tries to run contribution at reconcile with enough funds but not met browsing requirements', function () {
    const result = lib.contributionAdequateFundsReqNotMet()
    snapshot(this.test.fullTitle(), result)
  })
})

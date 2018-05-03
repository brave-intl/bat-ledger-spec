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

  it('Tries to run contribution before time to reconcile', function () {

  })

  it('Tries to run contribution at time of reconcile', function () {

  })

  it('Tries to run contribution at reconcile with enough funds', function () {

  })

  it('Tries to run contribution at reconcile with not enough funds', function () {

  })
})

/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this file,
* You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

/* global describe, before, beforeEach, after, it */

// const assert = require('assert')
const helper = require('../helper')
<<<<<<< HEAD
/* const snapshot = ommitted for now for lint */ require('snap-shot-it')
const mockery = require('mockery')

const lib = helper.getLib()
=======
const snapshot = require('snap-shot-it')
const mockery = require('mockery')

const lib = helper.getLib('contribution')

<<<<<<< HEAD
>>>>>>> Added contribution

=======
>>>>>>> wip
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
<<<<<<< HEAD

  })

  it('Tries to run contribution at time of reconcile', function () {

  })

  it('Tries to run contribution at reconcile with enough funds', function () {

  })

  it('Tries to run contribution at reconcile with not enough funds', function () {
=======
    const result = lib.contributionBeforeTime()
    snapshot(this.test.fullTitle(), result)
  })

  it.skip('Tries to run contribution at reconcile with enough funds', function () {

  })

  it.skip('Tries to run contribution at reconcile with not enough funds', function () {
>>>>>>> Added contribution

  })
})

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

/* global describe, before, beforeEach, after, it */

// const assert = require('assert')
const helper = require('../helper')
const snapshot = require('snap-shot-it')
const mockery = require('mockery')

const lib = helper.getLib('wallet')

describe('wallet', function () {
  before(function () {
    lib.before(mockery)
  })

  beforeEach(function () {
    lib.beforeEach(mockery)
  })

  after(function () {
    lib.after(mockery)
  })

  it('create', function () {
    const result = lib.createWallet()
    snapshot(this.test.fullTitle(), result)
  })

  describe('balance', function () {
    it('wallet marked as funded with balance', function () {
      const result = lib.setWalletProperties()
      console.log(result.getIn(['ledger', 'info', 'userHasFunded']))
    })

    it('wallet is not marked as funded with no balance', function () {
      const result = lib.setWalletProperties({balance: 0})
      // should be undefined
      console.log(result.getIn(['ledger', 'info', 'userHasFunded']))
    })
  })

  describe('properties', function () {

  })

  describe('backup', function () {
    it('generates back up key', function () {

    })
  })

  describe('recovery', function () {
    it('succeeds with valid key', function () {
      const state = lib.corruptWallet()
      lib.recoverWallet(state, 'test key')
    })

    it('fails with a key that is too short', function () {

    })

    it('fails with a key that is too short', function () {

    })

    it('fails with a key that is too long', function () {

    })

    it('fails with a non-string key', function () {
      const state = lib.corruptWallet()
      lib.recoverWallet(state, 2352)
    })

    it('fails with a key containing invalid words', function () {

    })
  })

  describe('validation', function () {
    it('verifies a valid seed', function () {

    })

    it('detects a corrupted seed', function () {

    })
  })
})

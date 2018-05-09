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
      const result = lib.setWalletProperties({balance: 10})
      snapshot(this.test.fullTitle(), lib.getInfo(result))
    })

    it('wallet is not marked as funded with no balance', function () {
      const result = lib.setWalletProperties()
      snapshot(this.test.fullTitle(), lib.getInfo(result))
    })
  })

  describe('properties', function () {
    it('generates wallet addresses', function () {
      const result = lib.setWalletProperties()
      snapshot(this.test.fullTitle(), lib.getInfo(result))
    })
  })

  describe('backup', function () {
    it('backs up wallet', function () {
      const walletState = lib._createWallet()
      const result = lib.backupWallet(walletState)
      snapshot(this.test.fullTitle(), lib.getPreferences(result))
    })
  })

  describe('recovery', function () {
    it('succeeds with valid key', function () {
      const walletState = lib._createWallet()
      const corruptedState = lib.corruptWallet(walletState)
      const result = lib.recoverWallet(corruptedState, lib.walletPassphrase)
      snapshot(this.test.fullTitle(), lib.getInfo(result))
    })

    it('fails with an invalid key', function () {
      const walletState = lib._createWallet()
      const corruptedState = lib.corruptWallet(walletState)
      const result = lib.recoverWallet(corruptedState, 'bogus key')
      snapshot(this.test.fullTitle(), lib.getInfo(result))
    })

    it('fails with a non-string key', function () {
      const walletState = lib._createWallet()
      const corruptedState = lib.corruptWallet(walletState)
      const result = lib.recoverWallet(corruptedState, 2352)
      snapshot(this.test.fullTitle(), lib.getInfo(result))
    })
  })
})

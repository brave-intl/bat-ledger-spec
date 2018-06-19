/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

/* global describe, before, beforeEach, after, afterEach it */

// const assert = require('assert')
const helper = require('../helper')
const snapshot = require('snap-shot-it')
const mockery = require('mockery')

const lib = helper.getLib('wallet')

describe('wallet', function () {
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

  it('create', function () {
    const result = lib.createWallet()
    snapshot(this.test.fullTitle(), lib.getInfo(result))
  })

  it('delete', function () {
    const result = lib.deleteWallet()
    snapshot(this.test.fullTitle(), lib.getInfo(result))
  })

  describe('recovery', function () {
    it('succeeds with a valid key', function () {
      const result = lib.recoverWallet('wasp broken strong analyst until tray olympic arrow input bicycle gun settle prepare tissue road try sustain husband width brave section obey country area')
      snapshot(this.test.fullTitle(), lib.getInfo(result))
    })
    it('fails with an invalid key', function () {
      const result = lib.recoverWallet('broken strong analyst until tray olympic arrow input bicycle gun settle prepare tissue road try sustain husband width brave section obey country area')
      snapshot(this.test.fullTitle(), lib.getInfo(result))
    })
    it('does not process with a non-string key', function () {
      const result = lib.recoverWallet(93247639267)
      snapshot(this.test.fullTitle(), lib.getInfo(result))
    })
    it('recovers a corrupted wallet', function () {
      const result = lib.recoverWallet('wasp broken strong analyst until tray olympic arrow input bicycle gun settle prepare tissue road try sustain husband width brave section obey country area', true)
      snapshot(this.test.fullTitle(), lib.getInfo(result))
    })
  })
})

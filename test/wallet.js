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

  describe('recovery', function () {
    it('recovers', function () {
      lib.clientInit()
      const result = lib.recoverWallet('wasp broken strong analyst until tray olympic arrow input bicycle gun settle prepare tissue road try sustain husband width brave section obey country area')
      snapshot(this.test.fullTitle(), result)
    })
  })
})

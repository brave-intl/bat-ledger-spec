/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

/* global describe, before, beforeEach, after, it */

const helper = require('../helper')
const snapshot = require('snap-shot-it')
const mockery = require('mockery')

const lib = helper.getLib('publisher')

describe('publisher', function () {
  before(function () {
    lib.before(mockery)
  })

  beforeEach(function () {
    lib.beforeEach(mockery)
  })

  after(function () {
    lib.after(mockery)
  })

  describe('add', function () {
    it('publisher', function () {
      const publisher = {
        publisherKey: 'brave.com',
        url: 'https://brave.com',
        tabId: 1,
        visitTime: 8500
      }
      const result = lib.addPublisher(publisher)
      snapshot(this.test.fullTitle(), result)
    })
  })
})

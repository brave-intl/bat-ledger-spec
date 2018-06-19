/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

/* global describe, before, beforeEach, after, afterEach, it */

const helper = require('../helper')
const snapshot = require('snap-shot-it')
const mockery = require('mockery')

const lib = helper.getLib('publisher')

describe('publisher', function () {
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

  describe('synopsis', function () {
    it('init', function () {
      const result = lib.initSynopsis()
      snapshot(this.test.fullTitle(), result)
    })
    it('delete', function () {
      const result = lib.deleteSynopsis()
      snapshot(this.test.fullTitle(), result)
    })
  })

  describe('add', function () {
    describe('manual', function () {
      it('single visit minimum', function () {
        const publisher = {
          publisherKey: 'brave.com',
          url: 'https://brave.com',
          tabId: 1
        }
        const result = lib.addPublisher(publisher, true, true)
        snapshot(this.test.fullTitle(), result)
      })
      it('excludes about page', function () {
        const publisher = {
          publisherKey: 'about:preferences',
          url: 'about:preferences',
          tabId: 1
        }
        const result = lib.addPublisher(publisher, true, true)
        snapshot(this.test.fullTitle(), result)
      })
    })
  })

  describe('pin', function () {
    it('pins', function () {
      const publisher = {
        publisherKey: 'brave.com',
        url: 'https://brave.com',
        tabId: 1
      }
      lib.addPublisher(publisher, true, true)
      const result = lib.pinPublisher('brave.com', 100)
      snapshot(this.test.fullTitle(), result)
    })
    it('pins multi', function () {
      const publisherOne = {
        publisherKey: 'brave.com',
        url: 'https://brave.com',
        tabId: 1
      }
      const publisherTwo = {
        publisherKey: 'clifton.io',
        url: 'https://clifton.io',
        tabId: 1
      }
      const publisherThree = {
        publisherKey: 'brianbondy.com',
        url: 'https://brianbondy.com',
        tabId: 1
      }
      lib.addPublisher(publisherOne, true, true)
      lib.addPublisher(publisherTwo, false, true)
      lib.addPublisher(publisherThree, false, true)

      lib.pinPublisher('brave.com', 40)
      lib.pinPublisher('clifton.io', 30)
      lib.pinPublisher('brianbondy.com', 25)

      snapshot(this.test.fullTitle(), lib.ledger.getSynopsis())
    })
  })

  describe('media', function () {
    describe('youtube', function () {
      it('logs visit ignoring minimum time', function () {
        const result = lib.invokeMediaRequest('youtube')
        snapshot(this.test.fullTitle(), result)
      })
      it('logs visit when minimum time is exceeded', function () {
        const result = lib.invokeMediaRequest('youtube', true)
        snapshot(this.test.fullTitle(), result)
      })
    })
  })
})

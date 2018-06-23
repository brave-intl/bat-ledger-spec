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
      lib.initSynopsis()
      snapshot(this.test.fullTitle(), lib.synopsis)
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
        lib.addPublisher(publisher)
        snapshot(this.test.fullTitle(), lib.synopsis)
      })
      it('excludes about page', function () {
        const publisher = {
          publisherKey: 'about:preferences',
          url: 'about:preferences',
          tabId: 1
        }
        lib.addPublisher(publisher)
        snapshot(this.test.fullTitle(), lib.synopsis)
      })
    })
  })

  describe('delete', function () {
    it('single', function () {
      const publisher = {
        publisherKey: 'brave.com',
        url: 'https://brave.com',
        tabId: 1
      }
      lib.addPublisher(publisher)
      lib.deletePublisher('brave.com')
      snapshot(this.test.fullTitle(), lib.synopsis)
    })
    it('multi', function () {
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
      lib.addPublisher(publisherOne)
      lib.addPublisher(publisherTwo, false)
      lib.addPublisher(publisherThree, false)

      lib.pinPublisher('brave.com', 40)
      lib.pinPublisher('brianbondy.com', 25)

      lib.deletePublisher('brianbondy.com')
      snapshot(this.test.fullTitle(), lib.synopsis)
    })
    it('pinned', function () {
      const publisher = {
        publisherKey: 'brave.com',
        url: 'https://brave.com',
        tabId: 1
      }
      lib.addPublisher(publisher)
      lib.pinPublisher('brave.com', 100)
      lib.deletePublisher('brave.com')
      snapshot(this.test.fullTitle(), lib.synopsis)
    })
  })

  describe('pin', function () {
    it('single', function () {
      const publisher = {
        publisherKey: 'brave.com',
        url: 'https://brave.com',
        tabId: 1
      }
      lib.addPublisher(publisher)
      lib.pinPublisher('brave.com', 100)
      snapshot(this.test.fullTitle(), lib.synopsis)
    })
    it('multi', function () {
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
      lib.addPublisher(publisherOne)
      lib.addPublisher(publisherTwo, false)
      lib.addPublisher(publisherThree, false)

      lib.pinPublisher('brave.com', 40)
      lib.pinPublisher('clifton.io', 30)
      lib.pinPublisher('brianbondy.com', 25)

      snapshot(this.test.fullTitle(), lib.synopsis)
    })
    it('unpins', function () {
      const publisher = {
        publisherKey: 'brave.com',
        url: 'https://brave.com',
        tabId: 1
      }
      lib.addPublisher(publisher)
      lib.pinPublisher('brave.com', 100)
      lib.pinPublisher('brave.com', 0, false)
      snapshot(this.test.fullTitle(), lib.ledger.getSynopsis())
    })
    it('unpins multi', function () {
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
      lib.addPublisher(publisherOne)
      lib.addPublisher(publisherTwo, false)
      lib.addPublisher(publisherThree, false)

      lib.pinPublisher('brave.com', 40)
      lib.pinPublisher('clifton.io', 30)
      lib.pinPublisher('brianbondy.com', 25)

      lib.pinPublisher('clifton.io', 0, false)
      snapshot(this.test.fullTitle(), lib.synopsis)
    })
  })

  describe('media', function () {
    describe('youtube', function () {
      it('logs visit ignoring minimum time', function () {
        lib.invokeMediaRequest('youtube')
        snapshot(this.test.fullTitle(), lib.synopsis)
      })
      it('logs visit when minimum time is exceeded', function () {
        lib.invokeMediaRequest('youtube', true)
        snapshot(this.test.fullTitle(), lib.synopsis)
      })
    })
    describe('twitch', function () {
      it('logs visit ignoring minimum time', function () {
        lib.invokeMediaRequest('twitch')
        snapshot(this.test.fullTitle(), lib.synopsis)
      })
    })
  })
})

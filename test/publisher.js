/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

/* global describe, before, beforeEach, after, it */

// const assert = require('assert')
const helper = require('../helper')
// const snapshot = require('snap-shot-it')
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
    describe('regular sites', function () {
      it.skip('manually adding site', function () {
        lib.manuallyAddSite({
          publisherKey: 'clifton.io',
          tabId: 1
        })
      })

      it('do not log about pages', function () {

      })

      describe('site visit', function () {
        it('not in the table', function () {
          lib.addSite({
            publisherKey: 'clifton.io',
            tabId: 1,
            visitTime: 8000
          }, false)
        })

        it('in the table', function () {

        })

        it('excluded by default', function () {

        })

        it('auto-include is off', function () {

        })

        it('site is PDF', function () {

        })
      })
    })

    describe('media publishers', function () {
      describe('YouTube', function () {

      })

      describe('Twitch', function () {

      })
    })
  })
})

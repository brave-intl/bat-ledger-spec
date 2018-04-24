/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

/* global describe */

// const assert = require('assert')
const helper = require('../helper')

const lib = helper.getLib()

describe('wallet', function () {
  describe('create', function () {
    lib.createWallet()
  })
})

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

const Lib = require('./index')
const error = require('../error')

class Contribution extends Lib {
  before () {
    error.setError('before')
  }

  beforeEach () {
    error.setError('beforeEach')
  }

  after () {
    error.setError('after')
  }

  afterEach () {
    error.setError('afterEach')
  }
}

module.exports = Lib

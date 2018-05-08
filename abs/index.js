/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

const error = require('../error/index')

class Lib {
  before () {
    error.setError('Function before is missing!')
  }

  beforeEach () {
    error.setError('Function beforeEach is missing!')
  }

  after () {
    error.setError('Function after is missing!')
  }

  afterEach () {
    error.setError('Function afterEach is missing!')
  }
}

module.exports = Lib

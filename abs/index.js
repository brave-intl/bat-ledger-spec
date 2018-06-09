/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

class Lib {
  before () {
    throw new Error('Function before is missing!')
  }

  beforeEach () {
    throw new Error('Function beforeEach is missing!')
  }

  after () {
    throw new Error('Function after is missing!')
  }

  afterEach () {
    throw new Error('Function afterEach is missing!')
  }
}

module.exports = Lib

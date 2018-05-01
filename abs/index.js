/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

class Lib {
  setError (text) {
    throw new Error(`Function ${text} is missing!`)
  }

  before () {
    this.setError('before')
  }

  beforeEach () {
    this.setError('beforeEach')
  }

  after () {
    this.setError('after')
  }

<<<<<<< HEAD:abs/index.js
  afterEach () {
    throw new Error('Function afterEach is missing!')
=======
  createWallet () {
    this.setError('createWallet')
>>>>>>> Added contribution:abs.js
  }
}

module.exports = Lib

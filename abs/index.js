/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

<<<<<<< HEAD
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
=======
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
>>>>>>> Added contribution
  }

<<<<<<< HEAD:abs/index.js
  afterEach () {
<<<<<<< HEAD
    throw new Error('Function afterEach is missing!')
=======
  createWallet () {
    this.setError('createWallet')
>>>>>>> Added contribution:abs.js
=======
    error.setError('afterEach')
>>>>>>> Added contribution
  }
}

module.exports = Lib

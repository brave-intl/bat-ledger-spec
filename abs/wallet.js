/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

const Lib = require('./index')
const err = require('../error/index')

class Wallet extends Lib {
  createWallet () {
    err.setError('Function createWallet is missing!')
  }
}

module.exports = Wallet

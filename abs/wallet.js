/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

const Spec = require('../js/spec')

class Wallet extends Spec {
  setStateFile () {
    throw new Error('Function setStateFile is missing!')
  }

  fallbackToPrevWallet () {
    throw new Error('Function fallbackToPrevWallet is missing!')
  }

  modifyDateStamp () {
    throw new Error('Function modifyDateStamp is missing!')
  }

  enable () {
    throw new Error('Function enable is missing!')
  }

  createWallet () {
    throw new Error('Function createWallet is missing!')
  }

  deleteWallet () {
    throw new Error('Function deleteWallet is missing!')
  }

  corruptWallet () {
    throw new Error('Function corruptWallet is missing!')
  }

  recoverWallet () {
    throw new Error('Function recoverWallet is missing!')
  }
}

module.exports = Wallet

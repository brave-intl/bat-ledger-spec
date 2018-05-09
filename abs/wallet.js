/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

const Lib = require('./index')

class Wallet extends Lib {
  getInfo () {
    throw new Error('Function getInfo is missing!')
  }

  getStatus () {
    throw new Error('Function getStatus is missing!')
  }

  _createWallet () {
    throw new Error('Function _createWallet is missing!')
  }

  createWallet () {
    throw new Error('Function createWallet is missing!')
  }

  corruptWallet () {
    throw new Error('Function corruptWallet is missing!')
  }

  backupWallet () {
    throw new Error('Function backupWallet is missing!')
  }

  recoverWallet () {
    throw new Error('Function recoverWallet is missing!')
  }

  setWalletProperties () {
    throw new Error('Function setWalletProperties is missing!')
  }
}

module.exports = Wallet

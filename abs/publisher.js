/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

const Lib = require('./index')

class Publisher extends Lib {
  addSite () {
    throw new Error('Function addSite is missing!')
  }

  addMedia () {
    throw new Error('Function addMedia is missing!')
  }

  manuallyAddSite () {
    throw new Error('Function manuallyAddSite is missing!')
  }
}

module.exports = Publisher

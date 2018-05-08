/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

const Lib = require('./index')
const error = require('../error')

class Publisher extends Lib {
  addSite () {
    error.setError('Function addSite is missing!')
  }

  addMedia () {
    error.setError('Function addMedia is missing!')
  }

  manuallyAddSite () {
    error.setError('Function manuallyAddSite is missing!')
  }
}

module.exports = Publisher

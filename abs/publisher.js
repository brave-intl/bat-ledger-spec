/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

const Lib = require('./index')

class Publisher extends Lib {
  initSynopsis () {
    throw new Error('Function initSynopsis is missing!')
  }

  deleteSynopsis () {
    throw new Error('Function deleteSynopsis is missing!')
  }

  addPublisher () {
    throw new Error('Function addPublisher is missing!')
  }
}

module.exports = Publisher

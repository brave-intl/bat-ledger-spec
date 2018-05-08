/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this file,
* You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

const Lib = require('./index')
const error = require('../error')

class Contribution extends Lib {
  contributionBeforeTime () {
    error.setError('contributionBeforeTime')
  }

  contributionMinusFunds () {
    error.setError('contributionMinusFunds')
  }

  contributionAdequateFunds () {
    error.setError('contributionAdequateFunds')
  }
}

module.exports = Contribution

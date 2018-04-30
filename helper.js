/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

function getLib () {
  if (process.env.TYPE === 'js') {
    const JS = require('./js/index')
    return new JS()
  } else if (process.env.TYPE === 'c') {
    const C = require('./c/index')
    return new C()
  }
}

function isJS () {
  return process.env.TYPE === 'js'
}

module.exports = {
  getLib,
  isJS
}

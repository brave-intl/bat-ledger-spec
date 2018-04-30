/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const fakeLevel = (pathName) => {
  return {
    batch: function (entries, cb) {
      if (typeof cb === 'function') cb()
    },
    get: function (key, cb) {
      if (typeof cb === 'function') cb(null, '{"' + key + '": "value-goes-here"}')
    }
  }
}

module.exports = fakeLevel

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const fakeAdBlock = {
  FilterOptions: {
    noFilterOption: 0,
    script: 0o1,
    image: 0o2,
    stylesheet: 0o4,
    object: 0o10,
    xmlHttpRequest: 0o20,
    objectSubrequest: 0o40,
    subdocument: 0o100,
    document: 0o200,
    other: 0o400,
    xbl: 0o1000,
    collapse: 0o2000,
    doNotTrack: 0o4000,
    elemHide: 0o10000,
    thirdParty: 0o20000,
    notThirdParty: 0o40000
  },
  AdBlockClient: function () {
  }
}

module.exports = fakeAdBlock

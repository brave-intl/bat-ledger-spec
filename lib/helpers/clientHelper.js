/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

// const Immutable = require('immutable')

// const cbResult = (state, ledger) => {
//   const initialResult = Immutable.fromJS(JSON.parse(state))
//   const initialSeed = initialResult.getIn(['properties', 'wallet', 'keyinfo', 'seed'])

//   const seed = ledger.uintKeySeed(initialSeed.toJS())
//   const result = initialResult
//     .setIn(['roundtrip'], ledger.roundtrip)
//     .setIn(['properties', 'wallet', 'keyinfo', 'seed'], seed)

//   return result
// }

const clientInit = (ledger, state) => {
  state = ledger.init(state)
  return state
}

const clientBoot = (ledger, state, client) => {
  state = ledger.onBootStateFile(state, ledger, client)
  // state = ledger.onCallback(state, cbResult(state, ledger), -1)
  return state
}

module.exports = {
  clientInit,
  clientBoot
}

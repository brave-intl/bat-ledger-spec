/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const staticizeState = (infoState) => {
  infoState = _staticizeBallots(infoState)
  infoState = _staticizeReconcileStamp(infoState)
  return _staticizePassphrase(infoState)
}

const _staticizeBallots = (infoState) => {
  if (infoState.getIn(['transactions'])) {
    let transaction = infoState.getIn(['transactions']).toJS()
    transaction[0].ballots['brianbondy.com'] = 19
    transaction[0].ballots['bumpsmack.com'] = 26
    transaction[0].ballots['clifton.io'] = 13
    return infoState.setIn(['transactions'], transaction)
  }
  return infoState
}

const _staticizePassphrase = (infoState) => {
  return infoState.getIn(['passphrase'])
    ? infoState.setIn(['passphrase'], 'proof stock music predict throw exercise another spot tunnel minimum tomorrow obscure saddle fortune walk always attract fortune acquire lend author quantum orchard retire')
    : infoState
}

const _staticizeReconcileStamp = (infoState) => {
  return infoState.getIn(['reconcileStamp'])
    ? infoState.setIn(['reconcileStamp'], 1528948800000)
    : infoState
}

module.exports = {
  staticizeState
}

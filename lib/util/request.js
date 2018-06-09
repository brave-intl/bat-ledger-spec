/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this file,
* You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

const urlFormat = require('url').format
const underscore = require('underscore')
const responses = require('../data/responses')
const reconcileResponses = require('../data/contribution-responses')
const urlParse = require('../../browser-laptop/app/common/urlParse')

const hostLookup = {
  'ledger.brave.com': 'ledger-proxy.privateinternetaccess.com',
  'ledger-staging.mercury.basicattentiontoken.org': 'mercury-proxy.privateinternetaccess.com'
}

const getResponse = (url, currWallet, httpMethod) => {
  let response = {}
  const path = urlParse(url).path
  if (httpMethod === 'GET') {
    if (path.match(/\/v2\/wallet\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\?refresh=true&amount=[0-9]+&altcurrency=BAT/i)) {
      return JSON.stringify(reconcileResponses['reconcileWalletQueryResp'])
    } else if (path.match(/\/v2\/wallet\?publicKey/)) {
      return JSON.stringify(responses['/v2/wallet/id'][currWallet])
    } else if (path.match(/\/v2\/wallet/)) {
      return JSON.stringify(responses['/v2/wallet/balance'][currWallet || 'funded-wallet'])
    } else if (path.match(/\/v2\/registrar\/persona/)) {
      return path.split('/').length === 4
        ? JSON.stringify(responses['/v2/registrar/persona']['initial-registrar'])
        : JSON.stringify(responses['/v2/registrar/persona']['finished-registrar'])
    } else if (path.match(/\/v2\/surveyor\/contribution\/current/)) {
      return JSON.stringify(reconcileResponses['/v2/surveyor/contribution/current/id'])
    } else if (path.match(/\/v1\/publisher\/ruleset\?consequential=true/)) {
      return JSON.stringify(reconcileResponses['publisherRulesetResp'])
    } else if (path.match(/\/v2\/batch\/surveyor\/voting\/[a-f0-9]{31}/)) {
      return JSON.stringify(reconcileResponses['reconcileBatchSurveyorVotingResponse'])
    } else if (path.match(/\/v3\/publisher\/timestamp/)) {
      return JSON.stringify(responses['/v3/publisher/timestamp'])
    }
  } else if (httpMethod === 'PUT') {
    if (path.match(/\/v2\/wallet\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/)) {
      return JSON.stringify(reconcileResponses['reconcileWalletPUTResp'])
    }
  } else if (httpMethod === 'POST') {
    if (path.match(/\/v2\/registrar\/viewing\/[a-f0-9]{31}/)) {
      return JSON.stringify(reconcileResponses['reconcileViewingPostResp'])
    } else if (path.match(/\/v2\/registrar\/persona/)) {
      return !currWallet
        ? (path.split('/').length === 4
          ? JSON.stringify(responses['/v2/registrar/persona']['initial-registrar'])
          : JSON.stringify(responses['/v2/registrar/persona']['finished-registrar']))
        : (path.split('/').length === 4
          ? responses['/v2/registrar/persona']['initial-registrar']
          : responses['/v2/registrar/persona']['finished-registrar'])
    }
  }

  if (responses.hasOwnProperty(path)) {
    return responses[path]
  } else if (reconcileResponses.hasOwnProperty(path)) {
    return JSON.stringify(reconcileResponses[path])
  }

  return response
}

const request = (options, currWallet, callback, httpMethod) => {
  let params
  const responseBody = getResponse(options.url, currWallet, httpMethod)

  if (underscore.isEmpty(responseBody)) {
    callback(null, {statusCode: 200}, responseBody)
  }

  if (typeof options === 'string') {
    options = { url: options }
  }
  params = underscore.defaults(underscore.pick(options, [ 'method', 'headers' ]), { headers: {} })
  params.headers['accept-encoding'] = ''

  if (options.payload) {
    underscore.extend(params, {
      payload: JSON.stringify(options.payload),
      payload_content_type: params.headers['content-type'] || 'application/json; charset=utf-8'
    })
  }

  if (typeof options.url !== 'string') {
    return callback(new Error('URL is not valid'))
  }

  if (process.env.NODE_ENV === 'development' &&
  urlParse(options.url).protocol === 'http:') {
  }

  callback(null, {statusCode: 200, httpVersionMajor: 1, httpVersionMinor: 1}, responseBody)
}

const roundtrip = (params, options, callback, currWallet) => {
  let parts = typeof params.server === 'string' ? urlParse(params.server)
    : typeof params.server !== 'undefined' ? params.server
      : typeof options.server === 'string' ? urlParse(options.server) : options.server
  const binaryP = options.binaryP || params.binaryP
  const rawP = binaryP || options.rawP || options.scrapeP
  if (!params.method) {
    params.method = 'GET'
  }
  parts = underscore.extend(underscore.pick(parts, ['protocol', 'hostname', 'port']),
    underscore.omit(params, ['headers', 'payload', 'timeout']))

  if (params.useProxy) {
    if (hostLookup.hasOwnProperty(parts.hostname)) {
      parts.hostname = hostLookup[parts.hostname]
    }
  }

  const i = parts.path.indexOf('?')
  if (i !== -1) {
    parts.pathname = parts.path.substring(0, i)
    parts.search = parts.path.substring(i)
  } else {
    parts.pathname = parts.path
  }

  if (options.windowP) {
    roundTripFromWindow({url: urlFormat(parts), verboseP: options.verboseP}, callback)
    return
  }

  options = {
    url: urlFormat(parts),
    method: params.method,
    payload: params.payload,
    responseType: binaryP ? 'binary' : 'text',
    headers: underscore.defaults(params.headers || {}, {
      'content-type': 'application/json; charset=utf-8',
      'user-agent': 'Brave/FakeUserAz'
    }),
    verboseP: options.verboseP
  }

  const requestCallbackFn = (err, response, body) => {
    let payload

    if (response && options.verboseP) {
      console.log('[ response for ' + params.method + ' ' + parts.protocol + '//' + parts.hostname + params.path + ' ]')
      console.log('>>> HTTP/' + response.httpVersionMajor + '.' + response.httpVersionMinor + ' ' + response.statusCode +
        ' ' + (response.statusMessage || ''))
      underscore.keys(response.headers).forEach((header) => {
        console.log('>>> ' + header + ': ' + response.headers[header])
      })
      console.log('>>>')
      console.log('>>> ' + (rawP ? '...' : (body || '').split('\n').join('\n>>> ')))
    }

    if (err) return callback(err, response)

    if (Math.floor(response.statusCode / 100) !== 2) {
      if (params.useProxy && response.statusCode === 403) {
        params.useProxy = false
        return module.exports.roundtrip(params, options, callback)
      }

      return callback(
        new Error('HTTP response ' + response.statusCode + ' for ' + params.method + ' ' + params.path),
        response)
    }

    try {
      payload = rawP ? body : (response.statusCode !== 204) ? JSON.parse(body) : null
    } catch (err) {
      return callback(err, response)
    }

    try {
      callback(null, response, payload)
    } catch (err0) {
      if (options.verboseP) console.log('\ncallback: ' + err0.toString() + '\n' + err0.stack)
    }
  }

  request(options, currWallet, requestCallbackFn, params.method)
}

const roundTripFromWindow = (params, callback) => {
  if (!callback) {
    return
  }

  if (!params || !params.url) {
    callback(new Error('Url is missing'))
    return
  }

  fetchPublisherInfo(params.url, {
    method: 'GET',
    responseType: 'text',
    headers: {
      'content-type': 'application/json; charset=utf-8'
    }
  }, (error, body) => {
    if (error) {
      return callback(error)
    }

    return callback(null, {statusCode: 200}, body)
  })
}

const fetchPublisherInfo = (url, options, callback) => {
  callback(null, {})
}

module.exports = {
  request,
  roundtrip,
  roundTripFromWindow,
  fetchPublisherInfo
}

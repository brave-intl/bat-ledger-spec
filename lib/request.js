/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

const req = require('request')
const underscore = require('underscore')
const urlParse = require('../browser-laptop/app/common/urlParse')

module.exports = (options, callback) => {
  var params
  var responseType = options.responseType || 'text'

  if (typeof options === 'string') options = { url: options }
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
    console.log('WARNING: requesting non-HTTPS URL', options.url)
  }

  req({url: options.url, qs: params}, (err, response, body) => {
    var rsp = underscore.pick(response || {}, [ 'statusCode', 'statusMessage', 'headers', 'httpVersionMajor', 'httpVersionMinor' ])

    underscore.keys(rsp.headers).forEach((header) => {
      if (Array.isArray(rsp.headers[header])) rsp.headers[header] = rsp.headers[header][0]
    })

    if (err) return callback(err, rsp)

    underscore.defaults(rsp, { statusMessage: '', httpVersionMajor: 1, httpVersionMinor: 1 })
    if (responseType !== 'text') body = Buffer.from(body, 'binary')
    if (responseType === 'blob') body = 'data:' + rsp.headers['content-type'] + ';base64,' + body.toString('base64')

    callback(null, rsp, body)
  })
}

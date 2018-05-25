exports['wallet create 1'] = {
  "options": {
    "scorekeepers": [
      "concave",
      "visits"
    ],
    "minPublisherDuration": 0,
    "numFrames": 30,
    "frameSize": 86400000,
    "_d": 0.000033333333333333335,
    "minPublisherVisits": 0,
    "scorekeeper": "concave",
    "emptyScores": {
      "concave": 0,
      "visits": 0
    },
    "_a": 7000,
    "_a2": 14000,
    "_a4": 28000,
    "_b": 1000,
    "_b2": 1000000
  },
  "publishers": {}
}

exports['wallet recovery succeeds with a valid key 1'] = {
  "paymentId": "7ec50587-223f-4189-a377-9d570a17ad1c",
  "created": true,
  "creating": true,
  "reconcileFrequency": 30,
  "reconcileStamp": 1529211991783,
  "passphrase": "attitude repeat entry hour suggest galaxy legal behave borrow process bean collect second dutch ketchup wrap rather actress entry swim indoor hour divorce come",
  "transactions": []
}

exports['wallet recovery fails with an invalid key 1'] = {
  "creating": true
}

exports['wallet recovery recovery does not process with a non-string key 1'] = {
  "creating": true,
  "error": {
    "caller": "recoverKeys",
    "error": true
  }
}

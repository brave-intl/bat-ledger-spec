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
  "addresses": {
    "BAT": "0x9076CE8d5e6aD43EBA94c7A909572DE0A39E7eFC",
    "BTC": "1NyTZUmwLJoDNhvJwKGCAAKPhbnGo4SVTd",
    "CARD_ID": "6c4dd79e-1008-4381-89d0-d6078963bef6",
    "ETH": "0x9076CE8d5e6aD43EBA94c7A909572DE0A39E7eFC",
    "LTC": "LLcZ6fFz9zdrMzf3f9ewno3xe6LPXoeVxK"
  },
  "unconfirmed": 0,
  "bravery": {
    "setting": "adFree",
    "days": 30,
    "fee": {
      "currency": "BAT",
      "amount": 10
    }
  },
  "contributionAmount": 10,
  "created": true,
  "passphrase": "attitude repeat entry hour suggest galaxy legal behave borrow process bean collect second dutch ketchup wrap rather actress entry swim indoor hour divorce come",
  "reconcileFrequency": 30,
  "monthlyAmounts": [
    5,
    7.5,
    10,
    12.5,
    15,
    17.5,
    20,
    25,
    50
  ],
  "converted": 0,
  "rates": {
    "BTC": "0.00004800",
    "ETH": 0.0005088939893845933,
    "LTC": 0.0025576784426820476,
    "USD": 0.352857648,
    "EUR": 0.29858461316111995
  },
  "probi": 0,
  "reconcileStamp": 1529211991783,
  "currentRate": 0.352857648,
  "creating": true,
  "balance": 0
}

exports['wallet recovery fails with an invalid key 1'] = {
  "creating": true,
  "error": {
    "caller": "recoveryWallet",
    "error": "Error: invalid passphrase:Error: Input words length 23 is not 24 or 16."
  }
}

exports['wallet recovery recovery does not process with a non-string key 1'] = {
  "creating": true
}

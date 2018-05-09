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

exports['wallet balance wallet marked as funded with balance 1'] = {
  "addresses": {
    "BAT": "0x1",
    "ETH": "0x22",
    "LTC": "0x333",
    "BTC": "0x4444",
    "CARD_ID": "0x55555"
  },
  "contributionAmount": 0,
  "created": true,
  "passphrase": "cake rib mammal salmon mix avocado file business garbage dove direct output daring zone mention gossip moon dog perfect glove miss snake deny pluck",
  "monthlyAmounts": [
    5,
    7.5,
    10,
    17.5,
    25,
    50,
    75,
    100
  ],
  "userHasFunded": true,
  "probi": 0,
  "creating": false,
  "walletQR": {
    "BAT": "data:image/png;base64,iVBORw0KGgoAAAANSUh",
    "ETH": "data:image/png;base64,iVBORw0KGgoAAAANSUh",
    "LTC": "data:image/png;base64,iVBORw0KGgoAAAANSUh",
    "BTC": "data:image/png;base64,iVBORw0KGgoAAAANSUh"
  },
  "balance": 10
}

exports['wallet balance wallet is not marked as funded with no balance 1'] = {
  "addresses": {
    "BAT": "0x1",
    "ETH": "0x22",
    "LTC": "0x333",
    "BTC": "0x4444",
    "CARD_ID": "0x55555"
  },
  "contributionAmount": 0,
  "created": true,
  "passphrase": "cake rib mammal salmon mix avocado file business garbage dove direct output daring zone mention gossip moon dog perfect glove miss snake deny pluck",
  "monthlyAmounts": [
    5,
    7.5,
    10,
    17.5,
    25,
    50,
    75,
    100
  ],
  "probi": 0,
  "creating": false,
  "walletQR": {
    "BAT": "data:image/png;base64,iVBORw0KGgoAAAANSUh",
    "ETH": "data:image/png;base64,iVBORw0KGgoAAAANSUh",
    "LTC": "data:image/png;base64,iVBORw0KGgoAAAANSUh",
    "BTC": "data:image/png;base64,iVBORw0KGgoAAAANSUh"
  },
  "balance": 0
}

exports['wallet properties generates wallet addresses 1'] = {
  "addresses": {
    "BAT": "0x1",
    "ETH": "0x22",
    "LTC": "0x333",
    "BTC": "0x4444",
    "CARD_ID": "0x55555"
  },
  "contributionAmount": 0,
  "created": true,
  "passphrase": "cake rib mammal salmon mix avocado file business garbage dove direct output daring zone mention gossip moon dog perfect glove miss snake deny pluck",
  "monthlyAmounts": [
    5,
    7.5,
    10,
    17.5,
    25,
    50,
    75,
    100
  ],
  "probi": 0,
  "creating": false,
  "walletQR": {
    "BAT": "data:image/png;base64,iVBORw0KGgoAAAANSUh",
    "ETH": "data:image/png;base64,iVBORw0KGgoAAAANSUh",
    "LTC": "data:image/png;base64,iVBORw0KGgoAAAANSUh",
    "BTC": "data:image/png;base64,iVBORw0KGgoAAAANSUh"
  },
  "balance": 0
}

exports['wallet backup backs up wallet 1'] = {
  "backupSucceeded": true,
  "updatedStamp": 1525962147521
}

exports['wallet recovery succeeds with valid key 1'] = {
  "walletQR": {},
  "addresses": {},
  "created": true,
  "creating": false,
  "passphrase": "cake rib mammal salmon mix avocado file business garbage dove direct output daring zone mention gossip moon dog perfect glove miss snake deny pluck"
}

exports['wallet recovery fails with an invalid key 1'] = {
  "error": {
    "caller": "recoverWallet",
    "error": "Invalid key"
  }
}

exports['wallet recovery fails with a non-string key 1'] = {
  "error": {
    "caller": "recoverWallet",
    "error": "Invalid key"
  }
}

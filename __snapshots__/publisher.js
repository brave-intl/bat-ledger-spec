exports['publisher synopsis init 1'] = {
  "options": {
    "scorekeepers": [
      "concave",
      "visits"
    ],
    "minPublisherDuration": 8000,
    "numFrames": 30,
    "frameSize": 86400000,
    "_d": 0.000033333333333333335,
    "minPublisherVisits": 1,
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

exports['publisher add manual single visit minimum 1'] = {
  "options": {
    "scorekeepers": [
      "concave",
      "visits"
    ],
    "minPublisherDuration": 8000,
    "numFrames": 30,
    "frameSize": 86400000,
    "_d": 0.000033333333333333335,
    "minPublisherVisits": 1,
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
  "publishers": {
    "brave.com": {
      "visits": 1,
      "duration": 8000,
      "options": {},
      "scores": {
        "concave": 1,
        "visits": 1
      },
      "window": [
        {
          "timestamp": 0,
          "visits": 1,
          "duration": 8000,
          "scores": {
            "concave": 1,
            "visits": 1
          }
        }
      ],
      "faviconURL": "data:image/png;base64,YnJhdmUuY29t"
    }
  }
}

exports['publisher add manual excludes about page 1'] = {
  "options": {
    "scorekeepers": [
      "concave",
      "visits"
    ],
    "minPublisherDuration": 8000,
    "numFrames": 30,
    "frameSize": 86400000,
    "_d": 0.000033333333333333335,
    "minPublisherVisits": 1,
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
  "publishers": {
    "about:preferences": {
      "visits": 0,
      "duration": 0,
      "options": {
        "exclude": true
      },
      "scores": {
        "concave": 0,
        "visits": 0
      },
      "window": [
        {
          "timestamp": 0,
          "visits": 0,
          "duration": 0,
          "scores": {
            "concave": 0,
            "visits": 0
          }
        }
      ],
      "faviconURL": "data:image/png;base64,YWJvdXQ6cHJlZmVyZW5jZXM="
    }
  }
}

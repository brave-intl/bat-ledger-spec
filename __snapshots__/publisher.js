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

exports['publisher synopsis delete 1'] = {
  "about": {
    "synopsis": [],
    "synopsisOptions": {}
  },
  "info": {},
  "locations": {},
  "synopsis": {
    "options": {},
    "publishers": {}
  },
  "promotion": {}
}

exports['publisher add organic does not add site visit under the minimum time 1'] = {
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
  "publishers": {}
}

exports['publisher delete single 1'] = {
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

exports['publisher delete multi 1'] = {
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
      "faviconURL": "data:image/png;base64,YnJhdmUuY29t",
      "pinPercentage": 100,
      "weight": 100
    },
    "clifton.io": {
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
      "faviconURL": "data:image/png;base64,Y2xpZnRvbi5pbw=="
    }
  }
}

exports['publisher delete pinned 1'] = {
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

exports['publisher pin single 1'] = {
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
      "faviconURL": "data:image/png;base64,YnJhdmUuY29t",
      "pinPercentage": 100,
      "weight": 100
    }
  }
}

exports['publisher pin multi 1'] = {
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
      "faviconURL": "data:image/png;base64,YnJhdmUuY29t",
      "pinPercentage": 53,
      "weight": 52.5
    },
    "clifton.io": {
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
      "faviconURL": "data:image/png;base64,Y2xpZnRvbi5pbw==",
      "pinPercentage": 22,
      "weight": 22.5
    },
    "brianbondy.com": {
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
      "faviconURL": "data:image/png;base64,YnJpYW5ib25keS5jb20=",
      "pinPercentage": 25,
      "weight": 25
    }
  }
}

exports['publisher pin unpins 1'] = {
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
      "faviconURL": "data:image/png;base64,YnJhdmUuY29t",
      "pinPercentage": 0,
      "weight": 100
    }
  }
}

exports['publisher pin unpins multi 1'] = {
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
      "faviconURL": "data:image/png;base64,YnJhdmUuY29t",
      "pinPercentage": 68,
      "weight": 67.94871794871796
    },
    "clifton.io": {
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
      "faviconURL": "data:image/png;base64,Y2xpZnRvbi5pbw==",
      "pinPercentage": 0,
      "weight": 22
    },
    "brianbondy.com": {
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
      "faviconURL": "data:image/png;base64,YnJpYW5ib25keS5jb20=",
      "pinPercentage": 32,
      "weight": 32.05128205128205
    }
  }
}

exports['publisher media youtube logs visit ignoring minimum time 1'] = {
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
    "youtube#channel:bgfilms": {
      "visits": 1,
      "duration": 2181,
      "options": {},
      "scores": {
        "concave": 0.4913089067864086,
        "visits": 1
      },
      "window": [
        {
          "timestamp": 0,
          "visits": 1,
          "duration": 2181,
          "scores": {
            "concave": 0.4913089067864086,
            "visits": 1
          }
        }
      ],
      "faviconName": "Binging with Babish",
      "faviconURL": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAA",
      "publisherURL": "https://www.youtube.com/user/bgfilms/videos",
      "providerName": "YouTube"
    }
  }
}

exports['publisher media youtube logs visit when minimum time is exceeded 1'] = {
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
    "youtube#channel:bgfilms": {
      "visits": 1,
      "duration": 8180,
      "options": {},
      "scores": {
        "concave": 1.0119335422655318,
        "visits": 1
      },
      "window": [
        {
          "timestamp": 0,
          "visits": 1,
          "duration": 8180,
          "scores": {
            "concave": 1.0119335422655318,
            "visits": 1
          }
        }
      ],
      "faviconName": "Binging with Babish",
      "faviconURL": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAA",
      "publisherURL": "https://www.youtube.com/user/bgfilms/videos",
      "providerName": "YouTube"
    }
  }
}

exports['publisher media twitch logs visit ignoring minimum time 1'] = {
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
    "twitch#author:ninja": {
      "visits": 2,
      "duration": 0,
      "options": {},
      "scores": {
        "concave": 0,
        "visits": 2
      },
      "window": [
        {
          "timestamp": 0,
          "visits": 2,
          "duration": 0,
          "scores": {
            "concave": 0,
            "visits": 2
          }
        }
      ],
      "faviconName": "ninja",
      "publisherURL": "https://www.twitch.tv/ninja/videos",
      "providerName": "Twitch"
    }
  }
}

exports['publisher add organic adds site when visit meets the minimum time 1'] = {
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

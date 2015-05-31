function OptimalBot(options) {
  var possibleLanes = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]
  ]

  makeMove: function() {
    var mark;

    if (this.attemptVictory) {
      mark = this.attemptVictory;
    } else {
      mark = this.preventDefeat;
    }

    // Render move to 
  },

  preventDefeat: function() {
    // iterate over possible lanes, check if any lane has two playerMarks and zero aimarks, mark in last spot if so
  },

  attemptVictory: function() {
    // iterate over possible lanes, check if any lane has two aiMarks and zero playermarks. if not, return false. else, return integer (index)
  }
}
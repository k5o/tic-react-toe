var Game = React.createClass({
  getInitialState: function() {
    return {
      gridMarks: ['', '', '', '', '', '', '', '', ''],
      turn: 0,
      playerMark: this.props.playerMark,
      aiMark: this.props.aiMark,
      isHumanTurn: true,
      aiWinPossible: true,
      gameOver: false,
    }
  },

  updateGrid: function(index) {
    if (this.state.isHumanTurn && !this.state.gameOver) {
      var isAIWinPossible = this.state.aiWinPossible;
      var newGrid = this.state.gridMarks.slice();

      if (this.state.turn === 1 && index === 4) {
        isAIWinPossible = false;
      }

      newGrid[index] = this.state.playerMark;

      this.setState({
        gridMarks: newGrid,
        isHumanTurn: !this.state.isHumanTurn,
        turn: this.state.turn + 1,
        aiWinPossible: isAIWinPossible,
      })
    } else {
      return false;
    }
  },

  componentDidUpdate: function() {
    if (!this.state.gameOver) {
      if (this.state.turn > 5) {
        this.checkWinCondition();
      }

      if (!this.state.isHumanTurn) {
        this.aiMakeMove();

        this.setState({
          isHumanTurn: !this.state.isHumanTurn,
          turn: this.state.turn + 1,
        });
      }
    }
  },

  render: function() {
    var grid = []

    for (var i = 0; len = this.state.gridMarks.length, i < len; i++) {
      grid.push(<Cell key={i} index={i} mark={this.state.gridMarks[i]} handleClick={this.updateGrid} />)
    }

    return (
      <div className="grid">
        {grid}
      </div>
    )
  },

  checkWinCondition: function() {
    var winningLane = GridHelper.allLanes().find(function(cells) {
      var markCheck = this.state.gridMarks[cells[0]];

      return (markCheck && this.state.gridMarks[cells[1]] === markCheck && this.state.gridMarks[cells[2]] === markCheck)
    }.bind(this));

    if (winningLane) {
      this.endGame(this.state.gridMarks[winningLane[0]]);
    } else if (!winningLane && this.state.turn === this.state.gridMarks.length) {
      this.endGame();
    } else {
      return false;
    }
  },

  endGame: function(mark) {
    var resetMessage = " Click Reset to try again.";

    if (mark === aiMark) {
      alert("Game Theory Optimal bot wins!" + resetMessage);
    } else if (mark === playerMark) {
      alert("You won! But this shouldn't have happened." + resetMessage);
    } else if (!mark) {
      alert("Draw!" + resetMessage);
    }

    this.setState({gameOver: true})
  },

  aiMakeMove: function() {
    var mark = '';

    var winAttempt = this.aiAttemptVictory();
    var preventDefeat = this.aiPreventDefeat();

    if (this.state.aiWinPossible && winAttempt) {
      mark = winAttempt;
    } else if (preventDefeat) {
      mark = preventDefeat;
    } else {
      mark = GridHelper.cornerCells.find(function(cell) {
        var cellValue = this.state.gridMarks[cell];

        return (cellValue === '' || !cellValue === this.state.playerMark);
      }.bind(this));
    }


    var newGrid = this.state.gridMarks.slice();

    newGrid[mark] = this.state.aiMark;

    this.setState({
      gridMarks: newGrid
    });
  },

  aiPreventDefeat: function() {
    var unmarkedIndices = [];
    var dangerLane = GridHelper.allLanes().find(function(cells) {
      var counter = 0;

      for (var i = 0; len = cells.length, i < len; i++) {
        if (this.state.gridMarks[cells[i]] === this.state.aiMark) {
          break;
        } else if (this.state.gridMarks[cells[i]] === this.state.playerMark) {
          counter++;
        } else {
          unmarkedIndices.push(cells[i]);
        }
      }

      return counter === 2
    }.bind(this));

    if (dangerLane && unmarkedIndices) {
      return unmarkedIndices.find(function(cell) {
        return dangerLane.indexOf(cell) > -1;
      });
    } else {
      return false;
    }
  },

  // iterate over possible lanes, check if any lane has two aiMarks and zero playermarks. if not, return false. else, return integer (index)
  aiAttemptVictory: function() {
    {/* Take center piece if human doesn't take it */}
    if (this.state.turn === 1 && this.state.gridMarks[4] === '') {
      return 4
    } else {
      {/* Iterate over offensive lanes, if any of them have two AIs and no Human marks, return that, else false */}

      var unmarkedIndices = [];
      var winningLane = GridHelper.offensiveLanes().find(function(cells) {
        var counter = 0;

        for (var i = 0; len = cells.length, i < len; i++) {
          if (this.state.gridMarks[cells[i]] === this.state.playerMark) {
            break;
          } else if (this.state.gridMarks[cells[i]] === this.state.aiMark) {
            counter++;
          } else {
            unmarkedIndices.push(cells[i]);
          }
        }

        return counter === 2
      }.bind(this));

      if (winningLane && unmarkedIndices) {
        return unmarkedIndices.find(function(cell) {
          return winningLane.indexOf(cell) > -1;
        });
      } else {
        return false;
      }

    }
  }

});

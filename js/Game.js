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
        this.initializeTurn();

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

    this.setState({gameOver: true});
  },

  initializeTurn: function() {
    var markIndex = '';
    var winAttempt = this.planMove(GridHelper.offensiveLanes(), this.state.aiMark, this.state.playerMark);
    var preventDefeat = this.planMove(GridHelper.allLanes(), this.state.playerMark, this.state.aiMark);
    var newGrid = this.state.gridMarks.slice();

    if (this.state.aiWinPossible && winAttempt) { // Attempt to win if possible
      markIndex = winAttempt;

    } else if (preventDefeat) { // Block player win attempt
      markIndex = preventDefeat;

    } else { // Take a corner
      markIndex = this.aiExecuteNeutralManeuver();

    }

    newGrid[markIndex] = this.state.aiMark;

    this.setState({gridMarks: newGrid});
  },

  aiAttemptDecisiveAction: function(lane, indices) {
    if (lane && indices) {
      return indices.find(function(cell) {
        return lane.indexOf(cell) > -1;
      });

    } else {
      return false;

    }
  },

  planMove: function(lanesToParse, markerToScan, markerToIgnore) {
    var unmarkedIndices = [];
    var centerCell = 4;

    if (this.state.turn === 1 && this.state.gridMarks[centerCell] === '') {
      return centerCell;
    }

    var lane = lanesToParse.find(function(cells) {
      var counter = 0;

      for (var i = 0; len = cells.length, i < len; i++) {
        if (this.state.gridMarks[cells[i]] === markerToIgnore) {
          break;

        } else if (this.state.gridMarks[cells[i]] === markerToScan) {
          counter++;

        } else {
          unmarkedIndices.push(cells[i]);

        }
      }

      return counter === 2
    }.bind(this));

    debugger

    return this.aiAttemptDecisiveAction(lane, unmarkedIndices);
  },

  aiExecuteNeutralManeuver: function() {
    return GridHelper.cornerCells().find(function(cell) {
      var cellValue = this.state.gridMarks[cell];

      return (cellValue === '' || !cellValue === this.state.playerMark);
    }.bind(this));
  }

});

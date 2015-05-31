var Game = React.createClass({
  getInitialState: function() {
    return {
      gridMarks: ['', '', '', '', '', '', '', '', ''],
      turn: 0,
      previousPlayerMoves: [],
      playerMark: this.props.playerMark,
      aiMark: this.props.aiMark,
      isHumanTurn: true,
      gameOver: false,
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

  resetGrid: function(event) {
    event.preventDefault();

    this.setState(this.getInitialState());
  },

  updateGrid: function(index) {
    if (this.state.isHumanTurn && !this.state.gameOver) {
      var newGrid = this.state.gridMarks.slice();
      var movesArray = this.state.previousPlayerMoves;

      newGrid[index] = this.state.playerMark;
      movesArray.push(index);

      this.setState({
        gridMarks: newGrid,
        isHumanTurn: !this.state.isHumanTurn,
        turn: this.state.turn + 1,
        previousPlayerMoves: movesArray
      })
    } else {
      return false;
    }
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
    var resetMessage = " Click Reset to play again.";
    var options = {
      confirmButtonText: "Ok",
      confirmButtonColor: "#81D4FA",
      allowOutsideClick: true
    };

    if (mark === aiMark) {
      options["title"] = "You Lose!";
      options["text"] = "Game Theory Optimal Bot can't be beaten!" + resetMessage;
      options["type"] = "error";

      swal(options);

    } else if (mark === playerMark) {
      options["title"] = "You Win!";
      options["text"] = "You won! Nice Hax." + resetMessage;
      options["type"] = "success";

      swal(options);

    } else if (!mark) {
      options["title"] = "Draw!";
      options["text"] = "Is that the best you can do?" + resetMessage;

      swal(options);

    }

    this.setState({gameOver: true});
  },

  initializeTurn: function() {
    var markIndex = '';
    var winAttempt = this.planMove(this.state.aiMark, this.state.playerMark);
    var preventDefeat = this.planMove(this.state.playerMark, this.state.aiMark);
    var newGrid = this.state.gridMarks.slice();

    if (winAttempt) { // Attempt to win (or take center cell) if possible
      markIndex = winAttempt;

    } else if (preventDefeat) { // Block player win attempt if any
      markIndex = preventDefeat;

    } else { // Take a blocking corner or any remaining cell
      markIndex = this.aiRespondWithClosest();

    }

    newGrid[markIndex] = this.state.aiMark;

    this.setState({gridMarks: newGrid});
  },

  planMove: function(markerToScan, markerToIgnore) {
    var unmarkedIndices = [];
    var centerCell = 4;
    var lanesToParse = GridHelper.allLanes();

    if (this.state.turn === 1 && this.state.gridMarks[centerCell] === '') {
      return centerCell;
    }

    var lane = lanesToParse.find(function(cells) {
      var counter = 0;

      for (var i = 0; len = cells.length, i < len; i++) {
        if (this.state.gridMarks[cells[i]] === markerToIgnore) {
          counter--;

        } else if (this.state.gridMarks[cells[i]] === markerToScan) {
          counter++;

        } else {
          unmarkedIndices.push(cells[i]);

        }
      }

      return counter === 2
    }.bind(this));

    // Attempt an advantageous action if possible
    if (lane && unmarkedIndices) {
      return unmarkedIndices.find(function(cell) {
        return lane.indexOf(cell) > -1;
      });
    } else {
      return false;
    }
  },

  // If there is no win or defeat condition available, AI needs to figure out the next best move
  // The next best move is as prioritized:
  // 1. Prevent potential forks on turn 3 by taking a blocking corner
  // 2. Take a corner
  // 3. Take anything left available (the game is destined for a draw by this point)
  aiRespondWithClosest: function() {
    var previousPlayerMoves = this.state.previousPlayerMoves.slice(-2);
    var lastMove = previousPlayerMoves[0];
    var secondToLastMove = previousPlayerMoves[1];
    var diff = Math.abs(lastMove - secondToLastMove);
    var cornerCells = GridHelper.cornerCells();
    var takeCornerCell;

    if (this.state.turn === 3 && (diff === 5 || diff === 7)) { // Prevent fork threats which only occur on turn 3
      takeCornerCell = GridHelper.findOptimalCornerCell(lastMove, secondToLastMove);
    } else if (lastMove < 4) { // Otherwise choose an open corner
      takeCornerCell = cornerCells.slice(0, 2).find(this.isCellAvailable);
    } else {
      takeCornerCell = cornerCells.slice(2).find(this.isCellAvailable);
    }

    if (takeCornerCell > -1) { // Favor corner cells
      return takeCornerCell;
    } else { // Otherwise fall back to any cell
      return this.state.gridMarks.findIndex(this.isCellEmpty);
    }
  },

  isCellAvailable: function(cell) {
    var cellValue = this.state.gridMarks[cell];

    return (cellValue === '' || !cellValue === this.state.playerMark);
  },

  isCellEmpty: function(cellValue) {
    return cellValue === '';
  },

  render: function() {
    var grid = []

    for (var i = 0; len = this.state.gridMarks.length, i < len; i++) {
      grid.push(<Cell key={i} index={i} mark={this.state.gridMarks[i]} handleClick={this.updateGrid} />)
    }

    return (
      <div>
        <p>
          <a href="#" onClick={this.resetGrid}>
            Reset
          </a>
        </p>

        <div className="grid">
          {grid}
        </div>
      </div>
    )
  }

});

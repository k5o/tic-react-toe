var Game = React.createClass({
  getInitialState: function() {
    return {
      grid: ['', '', '', '', '', '', '', '', ''],
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
        this.initializeAITurn();

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
      var newGrid = this.state.grid.slice();
      var movesArray = this.state.previousPlayerMoves;

      newGrid[index] = this.state.playerMark;
      movesArray.push(index);

      this.setState({
        grid: newGrid,
        isHumanTurn: !this.state.isHumanTurn,
        turn: this.state.turn + 1,
        previousPlayerMoves: movesArray
      });
    } else {
      return false;

    }
  },

  checkWinCondition: function() {
    var winningLane = GridHelper.allLanes().find(function(cells) {
      var markCheck = this.state.grid[cells[0]];

      return (markCheck && this.state.grid[cells[1]] === markCheck && this.state.grid[cells[2]] === markCheck);
    }.bind(this));

    if (winningLane) {
      this.endGame(this.state.grid[winningLane[0]]);

    } else if (!winningLane && this.state.turn === this.state.grid.length) {
      this.endGame(); // draw

    } else {
      return false;

    }
  },

  endGame: function(mark) {
    var customTitle;
    var customText;
    var customType;
    var resetMessage = " Click Reset to play again.";
    var options = {confirmButtonText: "Ok", confirmButtonColor: "#81D4FA", allowOutsideClick: true};

    if (mark === aiMark) {
      customTitle = "You Lose!";
      customText = "Game Theory Optimal Bot can't be beaten!";
      customType = "error";

    } else if (mark === playerMark) {
      customTitle = "You Win!";
      customText = "You won! Nice Hax.";
      customType = "success";

    } else if (!mark) {
      customTitle = "Draw!";
      customText = "Is that the best you can do?";

    }

    options["title"] = customTitle;
    options["text"] = customText + resetMessage;
    options["type"] = customType;

    swal(options);

    this.setState({gameOver: true});
  },

  initializeAITurn: function() {
    var markIndex = '';
    var winAttempt = this.planMove(this.state.aiMark, this.state.playerMark);
    var preventDefeat = this.planMove(this.state.playerMark, this.state.aiMark);
    var newGrid = this.state.grid.slice();

    if (winAttempt) { // Attempt to win (or take center cell) if possible
      markIndex = winAttempt;

    } else if (preventDefeat) { // Block player win attempt if any
      markIndex = preventDefeat;

    } else { // Take a blocking corner or any remaining cell
      markIndex = this.nextOptimalAIResponse();

    }

    newGrid[markIndex] = this.state.aiMark;

    this.setState({grid: newGrid});
  },

  planMove: function(markerToScan, markerToIgnore) {
    var unmarkedIndex;
    var centerCell = 4;
    var lanesToParse = GridHelper.allLanes();

    if (this.state.turn === 1 && this.state.grid[centerCell] === '') {
      return centerCell; // take center cell if available
    }

    var lane = lanesToParse.find(function(cells) {
      var counter = 0;

      for (var i = 0; len = cells.length, i < len; i++) {
        if (this.state.grid[cells[i]] === markerToIgnore) {
          counter--;

        } else if (this.state.grid[cells[i]] === markerToScan) {
          counter++;

        } else {
          unmarkedIndex = cells[i]; // last unmarked index if lane is found will be AI's optimal placement

        }
      }

      return counter === 2;
    }.bind(this));

    return (lane && unmarkedIndex || false); // Return advantageous placement if available
  },

  // If there is no win or defeat condition available, AI needs to figure out the next best move
  // The next best move is as prioritized:
  // 1. Prevent potential forks on turn 3 by taking a blocking corner
  // 2. Take a corner
  // 3. Take anything left available (the game is destined for a draw by this point)
  nextOptimalAIResponse: function() {
    var previousPlayerMoves = this.state.previousPlayerMoves.slice(-2);
    var secondToLastMove = previousPlayerMoves[0];
    var lastMove = previousPlayerMoves[1];
    var diff = Math.abs(lastMove - secondToLastMove);
    var cornerCells = GridHelper.cornerCells();
    var optimalCell;
    var forkConditionsPossible = this.state.turn === 3 && secondToLastMove !== 4 && (diff >= 4 && diff <= 8);

    if (forkConditionsPossible) { // Prevent fork threats
      optimalCell = GridHelper.findOptimalBlockingCell(lastMove, secondToLastMove);

    } else if (lastMove < 4) { // Otherwise choose an open corner
      optimalCell = cornerCells.slice(0, 2).find(this.isCellAvailable);

    } else {
      optimalCell = cornerCells.slice(2).find(this.isCellAvailable);

    }

    // favor any optimal corner cells, otherwise fall back to any empty cell
    return (optimalCell > -1 && optimalCell) || this.state.grid.findIndex(this.isCellEmpty);
  },

  isCellAvailable: function(cell) {
    var cellValue = this.state.grid[cell];

    return (cellValue === '' || !cellValue === this.state.playerMark);
  },

  isCellEmpty: function(cellValue) {
    return cellValue === '';
  },

  render: function() {
    var grid = []

    for (var i = 0; len = this.state.grid.length, i < len; i++) {
      grid.push(<Cell key={i} index={i} mark={this.state.grid[i]} handleClick={this.updateGrid} />);
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

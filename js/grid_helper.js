var GridHelper = {
  allLanes: function() {
    return [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],

      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],

      [0, 4, 8],
      [2, 4, 6]
    ];
  },

  cornerCells: function() {
    return [0, 2, 6, 8];
  },

  // If player takes the cell passed into the function, the return are the cells the AI bot must block
  validCornersForTakenCell: function(cell) {
    switch (cell) {
      case 0:
        return [2, 6]
      case 1:
        return [0, 2]
      case 2:
        return [0, 8]
      case 3:
        return [0, 6]
      case 5: // skip 4 intentionally, cannot make knight-shaped pincer with center cell
        return [2, 8]
      case 6:
        return [0, 8]
      case 7:
        return [6, 8]
      case 8:
        return [2, 6]
    }
  },

  // Depending on the two moves passed, one integer is returned that represents the cell the AI must block
  findOptimalCornerCell: function(lastMove, secondToLastMove) {
    return this.validCornersForTakenCell(lastMove).getIntersection( this.validCornersForTakenCell(secondToLastMove) );
  }
}
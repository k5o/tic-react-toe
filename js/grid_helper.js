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

  offensiveLanes: function() {
    return [
      [3, 4, 5],

      [1, 4, 7],

      [0, 4, 8],
      [2, 4, 6]
    ]
  },

  cornerCells: function() {
    return [0, 2, 6, 8];
  }
}
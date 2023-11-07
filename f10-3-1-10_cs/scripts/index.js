let grid = new Grid();
let tile = new Tile(
  {
    row: 0,
    column: 0
  },
  2
);
grid.add(tile);

let tile2 = new Tile(
  {
    row: 3,
    column: 3
  },
  1024
);
grid.add(tile2);
console.log(grid);

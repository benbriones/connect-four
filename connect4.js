"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

//const WIDTH = 7;
//const HEIGHT = 6;


//const board = []; // array of rows, each row is array of cells  (board[y][x])
// (board[5][0] would be the bottom-left spot on the board)


/** Creates Board, htmlBoard, and .... */
class Player {
  constructor(color) {
    this.color = color;
  }
}
class Game {
  constructor(p1, p2, width = 6, height = 7) {
    this.players = [p1, p2];
    this.width = width;
    this.height = height;
    this.board = [];
    this.currPlayer = p1; // active player: 1 or 2
    this.gameEnded = false;
    this.makeHtmlBoard();
    this.makeBoard();
  }

  /** makeBoard: fill in global `board`:
   * board = array of rows, each row is array of cells  (board[y][x])
 */
  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      const emptyRow = Array(this.width).fill(null);
      this.board.push(emptyRow);
    }
  }
  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    const htmlBoard = document.getElementById("board");
    htmlBoard.innerHTML = '';

    // creates top row
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", `top-${x}`);
      headCell.addEventListener("click", this.handleClick.bind(this)); // will have to use bind
      top.append(headCell);
    }
    htmlBoard.append(top);

    // dynamically creates the main part of html board
    // uses HEIGHT to create table rows
    // uses WIDTH to create table cells for each row
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `c-${y}-${x}`);
        row.append(cell);
      }
      htmlBoard.append(row);
    }
  }

  /** findSpotForCol: given column x, return y coordinate of furthest-down spot
   * (return null if filled) */
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (this.board[y][x] === null) {
        return y;
      }
    }
    return null;
  }
  /** placeInTable: update DOM to place piece into HTML table of board */
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;

    const spot = document.getElementById(`c-${y}-${x}`);
    spot.append(piece);
  }
  /** endGame: announce game end */
  endGame(msg) {
    this.gameEnded = true;
    alert(msg);
  }

  checkForWin() {
    const boardHeight = this.height;
    const boardLength = this.width;
    const boardGame = this.board;
    const currentPlayer = this.currPlayer;

    // arrow solution
    // const realThis = this

    // const _win = cells => {
    //   return cells.every(
    //     ([y, x]) =>
    //         y >= 0 &&
    //         y < this.height &&
    //         x >= 0 &&
    //         x < this.width &&
    //         this.board[y][x] === this.currPlayer
    //   )
    // }

    function _win(cells) {

      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      return cells.every(
          ([y, x]) =>
              y >= 0 &&
              y < boardHeight && // change to realThis.height
              x >= 0 &&
              x < boardLength &&
              boardGame[y][x] === currentPlayer
      );
    }

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) { // can also do _win.call(this, horiz) || _win.call(this, vert)...
          return true;
        }
      }
    }
    return false;
  }

  /** handleClick: handle click of column top to play piece */
  handleClick(evt) {
    if(this.gameEnded) {
      return;
    }
    // get x from ID of clicked cell
    const x = Number(evt.target.id.slice("top-".length)); // will probably have to take care of this
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer} won!`);
    }

    // check for tie: if top row is filled, board is filled
    if (this.board[0].every(cell => cell !== null)) {
      return this.endGame('Tie!');
    }

    // switch players
    this.currPlayer = this.currPlayer === this.players[1] ? this.players[0] : this.players[1];
  }
}
//create a button
const start = document.createElement("button");
start.textContent = "New Game!";
document.body.append(start);


start.addEventListener("click", evt => {
  const p1Color = document.querySelector("#p1").value;
  const p2Color = document.querySelector("#p2").value;
  const p1 = new Player(p1Color);
  const p2 = new Player(p2Color);
  new Game(p1, p2);
});



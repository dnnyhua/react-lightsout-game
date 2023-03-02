import { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
**/

/* 

  VISUALIZING the grid

  y = [
     0 1 2 3 4
    [F,T,T,F,F],  0
    [T,F,F,F,T],  1
    [F,F,T,F,T],  2
    [F,F,F,F,F],  3
    [T,F,T,F,T],  4
  ]
      
*/

function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = 0.3 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];

    // TODO: create array-of-arrays of true/false values
    for (let y = 0; y < nrows; y++) {
      let row = [];
      for (let x = 0; x < ncols; x++) {
        // This will return true or false and push to row array
        row.push(Math.random() < chanceLightStartsOn);
      }
      // once all rows and cols are created, push to initialBoard
      initialBoard.push(row)
    }
    return initialBoard;
  }

  function hasWon() {
    // TODO: check the board in state to determine whether the player has won.
    // This checks to see if in every row, that every cell is false which means everything is un-lit
    return board.every(row => row.every(cell => !cell));

  }
  // flip cells around the cell that was clicked on
  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        /* 
        This if statement is used to check whether cells around 
        the area of the cell that was clicked on is even on the board. 
        clicking on cell [0,0], which is on the edge, only cells to the right and bottom will flip.
        Prevent flipping cells that are not on the board.
        */
        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {

          // Making the cell at that coordinate true or false. If true it will be false, if false it will be true
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };
      // TODO: Make a (deep) copy of the oldBoard
      const boardCopy = oldBoard.map(row => [...row]);

      /* Visualizing the grid
      y = [
         0 1 2 3 4
        [F,T,T,F,F],  0
        [T,F,F,F,T],  1
        [F,F,T,F,T],  2
        [F,F,F,F,F],  3
        [T,F,T,F,T],  4
      ]
      */

      // TODO: in the copy, flip this cell and the cells around it
      flipCell(y, x, boardCopy);
      flipCell(y, x - 1, boardCopy);
      flipCell(y, x + 1, boardCopy);
      flipCell(y - 1, x, boardCopy);
      flipCell(y + 1, x, boardCopy);

      // This was for fun
      // flipCell(y - 1, x - 1, boardCopy); //top left corner
      // flipCell(y - 1, x + 1, boardCopy); //top right corner
      // flipCell(y + 1, x - 1, boardCopy); //bottom left corner
      // flipCell(y + 1, x + 1, boardCopy); //bottom right corner


      // TODO: return the copy
      return boardCopy;
    });
  }


  // if the game is won, just show a winning msg & render nothing else
  if (hasWon()) {
    return <div>Winner!</div>
  }

  // make table board

  let htmlBoard = [];

  for (let y = 0; y < nrows; y++) {
    let row = [];
    for (let x = 0; x < ncols; x++) {
      let coord = `${y}-${x}`
      row.push(
        <Cell
          key={coord}
          // isLit will be true or false
          isLit={board[y][x]}
          flipCellsAroundMe={() => flipCellsAround(coord)}
        />
      )
    }
    // this will push the row to htmlboard when all cols are added 
    htmlBoard.push(<tr key={y}>{row}</tr>)
  }

  // Once all rows are added to htmlBoard, render the htmlBoard
  return (
    <table className="Board">
      <tbody>{htmlBoard}</tbody>
    </table>
  )

}

export default Board;

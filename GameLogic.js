import GameBoard from "./Gameboard.js";

class GameLogic {

    constructor(gameBoard){
        this.gameBoard = gameBoard;
        this.currentPlayer = "X";
        this.gameOver = false;
    }

    rightClick(cell){
        //if game over, dont let user make a move
        if(this.gameOver){
            return;
        }

        //if(this.gameBoard.board[row][col] === null){
            this.gameBoard.updateCell(cell);
            //this.gameBoard.renderBoard("game-container");

            //if(this.checkForWin()){
             //   this.gameOver = true;
             //   alert('Player ${this.currentPlayer} wins!')
            //}else if(this.checkForDraw()){
            //    this.gameOver = true;
            //    alert("It's a draw!")
            //}else{
             //   this.switchPlayer(); 
            //}
        //}

    }

    leftClick(cell){
        //if game over, dont let user make a move
        if(this.gameOver){
            return;
        }

            this.gameBoard.openCell(cell);

            //if(this.checkForWin()){
             //   this.gameOver = true;
             //   alert('Player ${this.currentPlayer} wins!')
            //}else if(this.checkForDraw()){
            //    this.gameOver = true;
            //    alert("It's a draw!")
            //}else{
             //   this.switchPlayer(); 
            //}
        //}

    }


}

export default GameLogic;
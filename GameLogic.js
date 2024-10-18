
class GameLogic {

    constructor(gameBoard){
        this.gameBoard = gameBoard;
        //this.gameOver = false;
    }

    //setInterval(setTime, 1000);

    rightClick(cell){
        //if game over, dont let user make a move
        if(this.gameBoard.isgameOver === true){
            return;
        }

        //if(this.gameBoard.board[row][col] === null){
            this.gameBoard.updateCell(cell);
            //this.gameBoard.renderBoard("game-container");

            
        //}

    }

    leftClick(cell){
        //if game over, dont let user make a move
        if(this.gameBoard.isgameOver === true){
            return;
        }

            this.gameBoard.openCell(cell);

           
        //}

    }

}


export default GameLogic;
import GameBoard from "./Gameboard.js";
import GameLogic from "./GameLogic.js";
import UserInput from "./UserInput.js";

let mineCount = 40


const myGameBoard = new GameBoard(15, 15, mineCount);
myGameBoard.renderBoard("game-container", mineCount);

const gameLogic = new GameLogic(myGameBoard);
const userInput = new UserInput(gameLogic);




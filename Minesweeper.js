import GameBoard from "./Gameboard.js";
import GameLogic from "./GameLogic.js";
import UserInput from "./UserInput.js";

const myGameBoard = new GameBoard(15, 15);
myGameBoard.renderBoard("game-container");

const gameLogic = new GameLogic(myGameBoard);
const userInput = new UserInput(gameLogic);

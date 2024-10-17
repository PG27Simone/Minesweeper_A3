class UserInput {
    
    constructor(gameLogic){
        this.gameLogic = gameLogic;

        this.addEventListeners();

    }

    addEventListeners(){
        const gameContainer = document.getElementById("game-container");
        gameContainer.addEventListener("contextmenu", (event) => {
            event.preventDefault()
            const cell = event.target.closest("td");
            if(cell){
                //const row = parseInt(cell.dataset.row);
                //const col = parseInt(cell.dataset.col);
                this.gameLogic.rightClick(cell);
            }
        })

        gameContainer.addEventListener("click", (event) => {
            const cell = event.target.closest("td");
            if(cell){
                //const row = parseInt(cell.dataset.row);
                //const col = parseInt(cell.dataset.col);
                this.gameLogic.leftClick(cell);
            }
        })
    }
}

export default UserInput;
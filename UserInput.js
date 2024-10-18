class UserInput {
    
    constructor(gameLogic){
        this.gameLogic = gameLogic;

        this.addEventListeners();

    }

    addEventListeners(){
        const gameContainer = document.getElementById("game-container");
        //on right click to flag
        gameContainer.addEventListener("contextmenu", (event) => {
            event.preventDefault()
            const cell = event.target.closest("td");
            if(cell){
                this.gameLogic.rightClick(cell);
            }
        })

        //on left click to open
        gameContainer.addEventListener("click", (event) => {
            const cell = event.target.closest("td");
            if(cell){
                this.gameLogic.leftClick(cell);
            }
        })
    }
}

export default UserInput;
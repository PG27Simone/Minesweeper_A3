const tile_stats = {
    HIDDEN: "hidden",
    MINE: "mine",
	MINE_HIDDEN: "mine_hidden",
    NUMBER: "number",
    FLAGGED: "flagged",
    OPEN: "open",
}

class GameBoard {
    constructor(rows, cols, mineCount) {
        this.rows = rows;
        this.cols = cols;
        this.board = this.createBoard();
        this.isgameOver = false;
        this.flagCount = mineCount;
        this.firstclick = true;
        this.countCells = 0;
    }

    createBoard() {
        const board = [];
        for (let r = 0; r < this.rows; r++) {
            let row = [];
            for (let c = 0; c < this.cols; c++) {
                row.push(null);
            }
            board.push(row);
        }
        return board;
    }

    renderBoard(containerId, mineNum) {


        const container = document.getElementById(containerId);

        const table = document.createElement("table");

        table.classList.add("game-board");

        for (let r = 0; r < this.rows; r++) {
            const row = document.createElement("tr");
			row.classList.add("game-tile");

            for (let c = 0; c < this.cols; c++) {
                const cell = document.createElement("td");
                cell.setAttribute('id',this.countCells)
                cell.textContent = this.board[r][c] || "";
                cell.dataset.row = r;
                cell.dataset.col = c;
				//cell.dataset.isMine = false;
				cell.dataset.status = tile_stats.HIDDEN
                this.countCells++
                row.appendChild(cell);
            }

            table.appendChild(row);
        }

        container.appendChild(table);
	
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    createMines(mineNum){
        let count = 0;
            while (count < mineNum) {
                const cell = document.getElementById(this.getRandomInt(225))
                //make sure it doesnt create a mine on first clicked tile
                if(cell.dataset.status !== tile_stats.OPEN){
                    //if not already mine, set as mine
                    if(cell.dataset.status !== tile_stats.MINE_HIDDEN){
                        cell.dataset.status = tile_stats.MINE_HIDDEN
                        count++
                    }

                    
                }else{
                    cell.dataset.status = tile_stats.OPEN
                }
            }     
    }

    updateCell(cell) {

        if(!this.firstclick){
            //if tile is not hidden AND not flagged, dont do anything
            if(cell.dataset.status !== tile_stats.HIDDEN && cell.dataset.status !== tile_stats.FLAGGED && cell.dataset.status !== tile_stats.MINE_HIDDEN){
                return
            }
        
            //if tile status is flagged, unflag it and set it as hidden
            if(cell.dataset.status === tile_stats.FLAGGED){
                this.flagCount++
                document.getElementById("counter").innerHTML = this.flagCount;
                cell.dataset.status = tile_stats.HIDDEN
            }
           
            //else if it is hidden, flag it
            else{
                cell.dataset.status = tile_stats.FLAGGED
                this.flagCount--
                document.getElementById("counter").innerHTML = this.flagCount;
            }
        }
    }


	openCell(cell){

        let isDone = false

        if(!this.firstclick){

            //if tile is not hidden AND not flagged, dont do anything
            if(cell.dataset.status === tile_stats.MINE_HIDDEN){
                cell.dataset.status = tile_stats.MINE
                this.gameOver()	
            }
            else if(cell.dataset.status === tile_stats.FLAGGED){
                this.flagCount++
                document.getElementById("counter").innerHTML = this.flagCount;
                cell.dataset.status = tile_stats.OPEN
            }     
            else{
                cell.dataset.status = tile_stats.OPEN
            }
        }else{
            
            //on first clikc, set it to open
            cell.dataset.status = tile_stats.OPEN

            //open up first round

            let id = cell.id

            //clearing spaces around first click tile
            const left = document.getElementById(id*1 - 1)
            const right = document.getElementById(id*1 + 1)
            const up = document.getElementById(id*1 + 15)
            const down = document.getElementById(id*1 -15)
            const upright = document.getElementById(id*1 - 14)
            const downright = document.getElementById(id*1 + 16)
            const upleft = document.getElementById(id*1 - 16)
            const downleft = document.getElementById(id*1 + 14)
            left.dataset.status = tile_stats.OPEN
            right.dataset.status = tile_stats.OPEN
            up.dataset.status = tile_stats.OPEN
            down.dataset.status = tile_stats.OPEN
            upright.dataset.status = tile_stats.OPEN
            downright.dataset.status = tile_stats.OPEN
            upleft.dataset.status = tile_stats.OPEN
            downleft.dataset.status = tile_stats.OPEN

            this.createMines(40)

            this.firstclick = false;
    }

	}

	gameOver(){

        this.isgameOver = true;
        //you lost message
        const para = document.createElement("p")
        const node = document.createTextNode("You Lost...")
        para.appendChild(node)

        const container = document.getElementById("results")
        container.appendChild(para)
		
        //restart
        var button = document.createElement("button");
        button.innerHTML = "Restart?";
        var body = document.getElementById("results");
        body.appendChild(button);
        button.addEventListener ("click", function() {
        alert("did something");
        });
	}

    updateCounter(){
        window.onload = function() {
            var x = 0,
                max = 3000,
                ctr = document.getElementById("counter");
        
            function incrementCounter() {
               ctr.innerHTML = x;
               if (x++ < max)
                   setTimeout(incrementCounter, 100);
            }
        
            incrementCounter();
        }
    }
}

export default GameBoard;
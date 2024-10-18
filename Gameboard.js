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

    //get random number between 0 and 22 for mine generator
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

        if(!this.firstclick){

            //if tile is not hidden AND not flagged, dont do anything
            if(cell.dataset.status === tile_stats.MINE_HIDDEN){
                cell.dataset.status = tile_stats.MINE
                this.gameOver()	
            }
            else if(cell.dataset.status === tile_stats.FLAGGED){
                cell.dataset.status = tile_stats.FLAGGED
            }     
            else{
                cell.dataset.status = tile_stats.OPEN

                //numbering
                this.mineCounter(cell)
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

            if(left !== null && left.dataset.row === cell.dataset.row){
                left.dataset.status = tile_stats.OPEN
                this.mineCounter(left)
            }
            if(right !== null && right.dataset.row === cell.dataset.row){
                right.dataset.status = tile_stats.OPEN
                this.mineCounter(right)
            }
            if(up !== null){
                up.dataset.status = tile_stats.OPEN
                this.mineCounter(up)
            }
            if(down !== null){
                down.dataset.status = tile_stats.OPEN
                this.mineCounter(down)
            }
            if(upright !== null && upright.dataset.row !== cell.dataset.row){
                upright.dataset.status = tile_stats.OPEN
                this.mineCounter(upright)
            }
            if(downright !== null && downright.dataset.row === up.dataset.row){
                downright.dataset.status = tile_stats.OPEN
                this.mineCounter(downright)
            }
            if(upleft !== null && upleft.dataset.row === down.dataset.row){
                upleft.dataset.status = tile_stats.OPEN
                this.mineCounter(upleft)
            }
            if(downleft !== null && downleft.dataset.row !== cell.dataset.row ){
                downleft.dataset.status = tile_stats.OPEN
                this.mineCounter(downleft)
            }

            this.createMines(40)

            //now add numbers
            if(left !== null && left.dataset.row === cell.dataset.row){
                this.mineCounter(left)
            }
            if(right !== null && right.dataset.row === cell.dataset.row){
                this.mineCounter(right)
            }
            if(up !== null){
                this.mineCounter(up)
            }
            if(down !== null){
                this.mineCounter(down)
            }
            if(upright !== null && upright.dataset.row !== cell.dataset.row){
                this.mineCounter(upright)
            }
            if(downright !== null && downright.dataset.row === up.dataset.row){
                this.mineCounter(downright)
            }
            if(upleft !== null && upleft.dataset.row === down.dataset.row){
                this.mineCounter(upleft)
            }
            if(downleft !== null && downleft.dataset.row !== cell.dataset.row ){
                this.mineCounter(downleft)
            }

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

    checkAround(cell){

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

        console.log(left.dataset.status)

        if(left !== null && left.dataset.row === cell.dataset.row && left.dataset.status !== tile_stats.MINE_HIDDEN){
            left.dataset.status = tile_stats.OPEN
            
        }

        if(right !== null && right.dataset.row === cell.dataset.row && right.dataset.status !== tile_stats.MINE_HIDDEN){
            right.dataset.status = tile_stats.OPEN
        }
        if(up !== null && up.dataset.status !== tile_stats.MINE_HIDDEN){
            up.dataset.status = tile_stats.OPEN
        }
        if(down !== null && down.dataset.status !== tile_stats.MINE_HIDDEN){
            down.dataset.status = tile_stats.OPEN
        }
        if(upright !== null && upright.dataset.row !== cell.dataset.row && upright.dataset.status !== tile_stats.MINE_HIDDEN){
            upright.dataset.status = tile_stats.OPEN
        }
        if(downright !== null && downright.dataset.row === up.dataset.row && downright.dataset.status !== tile_stats.MINE_HIDDEN){
            downright.dataset.status = tile_stats.OPEN
        }
        if(upleft !== null && upleft.dataset.row === down.dataset.row && upleft.dataset.status !==tile_stats.MINE_HIDDEN){
            upleft.dataset.status = tile_stats.OPEN
        }
        if(downleft !== null && downleft.dataset.row !== cell.dataset.row && downleft.dataset.status !== tile_stats.MINE_HIDDEN){
            downleft.dataset.status = tile_stats.OPEN
        }
        

    }

    mineCounter(cell){

        let mineCount = 0;
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

        console.log(left.dataset.status)

        if(left !== null && left.dataset.row === cell.dataset.row && left.dataset.status === tile_stats.MINE_HIDDEN){
            mineCount++
        }
        if(right !== null && right.dataset.row === cell.dataset.row && right.dataset.status === tile_stats.MINE_HIDDEN){
            mineCount++
        }
        if(up !== null && up.dataset.status === tile_stats.MINE_HIDDEN){
            mineCount++
        }
        if(down !== null && down.dataset.status === tile_stats.MINE_HIDDEN){
            mineCount++
        }
        if(upright !== null && upright.dataset.row !== cell.dataset.row && upright.dataset.status === tile_stats.MINE_HIDDEN){
            mineCount++
        }
        if(downright !== null && downright.dataset.row === up.dataset.row && downright.dataset.status === tile_stats.MINE_HIDDEN){
            mineCount++
        }
        if(upleft !== null && upleft.dataset.row === down.dataset.row && upleft.dataset.status ===tile_stats.MINE_HIDDEN){
            mineCount++
        }
        if(downleft !== null && downleft.dataset.row !== cell.dataset.row && downleft.dataset.status === tile_stats.MINE_HIDDEN){
            mineCount++
        }
        //if more than 0 mines, display number
        if(mineCount >0){
        cell.textContent = mineCount
        }

    }

    

    
}

export default GameBoard;
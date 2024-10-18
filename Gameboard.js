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
        this.correctCount = 0;
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
                cell.dataset.isMine = 0;
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
                    cell.dataset.isMine = 1;
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

            if(cell.dataset.status === tile_stats.MINE_HIDDEN){
                cell.dataset.status = tile_stats.FLAGGED
                this.flagCount--
                document.getElementById("counter").innerHTML = this.flagCount;
                //up the correct win amount and check for win
                this.correctCount++
                if(this.correctCount === 39){
                    this.gameWin();
                }
                return
            }
        
            console.log(cell.dataset.isMine)
            //if tile status is flagged, unflag it and set it as hidden
            if(cell.dataset.status === tile_stats.FLAGGED){
                this.flagCount++
                document.getElementById("counter").innerHTML = this.flagCount;
                if(cell.dataset.isMine != 1){
                    cell.dataset.status = tile_stats.HIDDEN
                }
                else{
                    cell.dataset.status = tile_stats.MINE_HIDDEN
                }
            }
           
            //else if it is hidden, flag it
            else{
                this.correctCount--
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
            else if(cell.dataset.status === tile_stats.OPEN){
                return
            }    
            else{
                cell.dataset.status = tile_stats.OPEN

                //numbering
                this.moveNext(cell)  
            }

        }else{

            var timer = 0;
            window.setInterval(function () {
            timer = timer + 1;
            document.getElementById("timer").innerHTML = timer;
            }, 1000);

            this.firstclick = false;
            
            //on first clikc, set it to open
            cell.dataset.status = tile_stats.OPEN

            //open up first round
            let id = cell.id

            //clearing spaces around first click tile
            const left = document.getElementById(id*1 - 1)
            const right = document.getElementById(id*1 + 1)
            const up = document.getElementById(id*1 + 15)
            const down = document.getElementById(id*1 - 15)
            const upright = document.getElementById(id*1 - 14)
            const downright = document.getElementById(id*1 + 16)
            const upleft = document.getElementById(id*1 - 16)
            const downleft = document.getElementById(id*1 + 14)

            console.log(downleft)

            //opening surrounding cells
            if(left !== null && left.dataset.row === cell.dataset.row){
                left.dataset.status = tile_stats.OPEN
            }
            if(right !== null && right.dataset.row === cell.dataset.row){
                right.dataset.status = tile_stats.OPEN
            }
            if(up !== null){
                up.dataset.status = tile_stats.OPEN
            }
            if(down !== null){
                down.dataset.status = tile_stats.OPEN
            }
            if(upright !== null && upright.dataset.row !== cell.dataset.row){
                upright.dataset.status = tile_stats.OPEN
            }
            if(downright !== null && downright.dataset.row === up.dataset.row){
                downright.dataset.status = tile_stats.OPEN
            }
            if(upleft !== null && upleft.dataset.row === down.dataset.row){
                upleft.dataset.status = tile_stats.OPEN
            }
            if(downleft !== null && downleft.dataset.row !== cell.dataset.row ){
                downleft.dataset.status = tile_stats.OPEN
            }

            //create mines around 8x8 grid of start
            this.createMines(40)

            //now add numbers and spread
            if(left !== null && left.dataset.row === cell.dataset.row){
                this.mineCounter(left)
                this.checkAround(left)
                //this.moveNext(left)
            }
            if(right !== null && right.dataset.row === cell.dataset.row){
                this.mineCounter(right)
                this.checkAround(right)
                //this.moveNext(right)
            }
            if(up !== null){
                this.mineCounter(up)
                this.checkAround(up)
                //this.moveNext(up)
            }
            if(down !== null){
                this.mineCounter(down)
                this.checkAround(down)
                //this.moveNext(down)
            }
            if(upright !== null && upright.dataset.row !== cell.dataset.row){
                this.mineCounter(upright)
                this.checkAround(upright)
                //this.moveNext(upright)
            }
            if(downright !== null && downright.dataset.row === up.dataset.row){
                this.mineCounter(downright)
                this.checkAround(downright)
                //this.moveNext(downright)
            }
            if(upleft !== null && upleft.dataset.row === down.dataset.row){
                this.mineCounter(upleft)
                this.checkAround(upleft)
                //this.moveNext(upleft)
            }
            if(downleft !== null && downleft.dataset.row !== cell.dataset.row ){
                this.mineCounter(downleft)
                this.checkAround(downleft)
                //this.moveNext(downleft)
            }  
            
        this.moveNext(left) 
        this.moveNext(cell)     
        }
	}

    //win the game
    gameWin(){
        this.isgameOver = true;

        const para = document.createElement("p")
        const node = document.createTextNode("You Won!!!")
        para.appendChild(node)

        const container = document.getElementById("results")
        container.appendChild(para)

        //restart
        var button = document.createElement("button");
        button.className = "button2"    
        button.innerHTML = "Restart?";
        var body = document.getElementById("results");
        body.appendChild(button);
        button.addEventListener ("click", function() {
            history.go();
        });
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
        button.className = "button" 
        button.innerHTML = "Restart?";
        var body = document.getElementById("results");
        body.appendChild(button);
        button.addEventListener ("click", function() {
            history.go();
        });
	}

    checkAround(cell){

        //open up first round
        let id = cell.id

        //clearing spaces around first click tile
        const left = document.getElementById(id*1 - 1)
        const right = document.getElementById(id*1 + 1)
        const up = document.getElementById(id*1 + 15)
        const down = document.getElementById(id*1 - 15)
        const upright = document.getElementById(id*1 - 14)
        const downright = document.getElementById(id*1 + 16)
        const upleft = document.getElementById(id*1 - 16)
        const downleft = document.getElementById(id*1 + 14)

        //console.log(left.dataset.status)

        if(left !== null && left.dataset.row === cell.dataset.row && left.dataset.status !== tile_stats.MINE_HIDDEN && left.dataset.status !== tile_stats.NUMBER && cell.dataset.status !== tile_stats.NUMBER){
            left.dataset.status = tile_stats.OPEN
            this.mineCounter(left)
        }
        if(right !== null && right.dataset.row === cell.dataset.row && right.dataset.status !== tile_stats.MINE_HIDDEN && right.dataset.status !== tile_stats.NUMBER && cell.dataset.status !== tile_stats.NUMBER){
            right.dataset.status = tile_stats.OPEN
            this.mineCounter(right)
        }
        if(up !== null && up.dataset.status !== tile_stats.MINE_HIDDEN && up.dataset.status !== tile_stats.NUMBER && cell.dataset.status !== tile_stats.NUMBER){
            up.dataset.status = tile_stats.OPEN
            this.mineCounter(up)
        }
        if(down !== null && down.dataset.status !== tile_stats.MINE_HIDDEN && down.dataset.status !== tile_stats.NUMBER && cell.dataset.status !== tile_stats.NUMBER){
            down.dataset.status = tile_stats.OPEN
            this.mineCounter(down)
        }
        if(upright !== null && upright.dataset.row !== cell.dataset.row && upright.dataset.status !== tile_stats.MINE_HIDDEN && upright.dataset.status !== tile_stats.NUMBER && cell.dataset.status !== tile_stats.NUMBER){
            upright.dataset.status = tile_stats.OPEN
            this.mineCounter(upright)
        }
        if(downright !== null && downright.dataset.row === up.dataset.row && downright.dataset.status !== tile_stats.MINE_HIDDEN && downright.dataset.status !== tile_stats.NUMBER && cell.dataset.status !== tile_stats.NUMBER){
            downright.dataset.status = tile_stats.OPEN
            this.mineCounter(downright)
        }
        if(upleft !== null && upleft.dataset.row === down.dataset.row && upleft.dataset.status !==tile_stats.MINE_HIDDEN && upleft.dataset.status !== tile_stats.NUMBER && cell.dataset.status !== tile_stats.NUMBER){
            upleft.dataset.status = tile_stats.OPEN
            this.mineCounter(upleft)
        }
        if(downleft !== null && downleft.dataset.row !== cell.dataset.row && downleft.dataset.status !== tile_stats.MINE_HIDDEN && downleft.dataset.status !== tile_stats.NUMBER && cell.dataset.status !== tile_stats.NUMBER){
            downleft.dataset.status = tile_stats.OPEN
            this.mineCounter(downleft)
        } 

    }

    //count mines to put number on the cell
    mineCounter(cell){

        let mineCount = 0;
        //open up first round
        let id = cell.id

        //clearing spaces around first click tile
        const left = document.getElementById(id*1 - 1)
        const right = document.getElementById(id*1 + 1)
        const up = document.getElementById(id*1 + 15)
        const down = document.getElementById(id*1 - 15)
        const upright = document.getElementById(id*1 - 14)
        const downright = document.getElementById(id*1 + 16)
        const upleft = document.getElementById(id*1 - 16)
        const downleft = document.getElementById(id*1 + 14)

        //if mine hidden aorund, up the number
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
        //if more than 0 mines, display number inside the cell
        if(mineCount >0){
            cell.textContent = mineCount
            cell.dataset.status = tile_stats.NUMBER
        }

    }

    moveNext(cell){
        let id = cell.id

        //clearing spaces around first click tile
        const left = document.getElementById(id*1 - 1)
        const right = document.getElementById(id*1 + 1)
        const up = document.getElementById(id*1 + 15)
        const down = document.getElementById(id*1 - 15)        
        const upright = document.getElementById(id*1 - 14)
        const downright = document.getElementById(id*1 + 16)
        const upleft = document.getElementById(id*1 - 16)
        const downleft = document.getElementById(id*1 + 14)


        //now add numbers and spread
        if(left !== null && left.dataset.row === left.dataset.row && left.dataset.status === tile_stats.OPEN){
            this.mineCounter(left)
            this.checkAround(left)
        }
        if(right !== null && right.dataset.row === right.dataset.row && right.dataset.status === tile_stats.OPEN){
            this.mineCounter(right)
            this.checkAround(right)
        }
        if(up !== null && up.dataset.status === tile_stats.OPEN){
            this.mineCounter(up)
            this.checkAround(up)
        }
        if(down !== null && down.dataset.status === tile_stats.OPEN){
            this.mineCounter(down)
            this.checkAround(down)
        }
        if(upright !== null && upright.dataset.row !== upright.dataset.row && upright.dataset.status === tile_stats.OPEN){
            this.mineCounter(upright)
            this.checkAround(upright)
        }
        if(downright !== null && downright.dataset.row === up.dataset.row && downright.dataset.status === tile_stats.OPEN){
            this.mineCounter(downright)
            this.checkAround(downright)
        }
        if(upleft !== null && upleft.dataset.row === down.dataset.row && upleft.dataset.status === tile_stats.OPEN){
            this.mineCounter(upleft)
            this.checkAround(upleft)
        }
        if(downleft !== null && downleft.dataset.row !== downleft.dataset.row && downleft.dataset.status === tile_stats.OPEN ){
            this.mineCounter(downleft)
            this.checkAround(downleft)
        }

        this.moveNext(left)
        this.moveNext(right)
        this.moveNext(down)

    }
  
}

export default GameBoard;
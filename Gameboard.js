const tile_stats = {
    HIDDEN: "hidden",
    MINE: "mine",
	MINE_HIDDEN: "mine_hidden",
    NUMBER: "number",
    FLAGGED: "flagged",
}

class GameBoard {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.board = this.createBoard();
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

    renderBoard(containerId) {

		let count = 0;
        const container = document.getElementById(containerId);

        container.innerHTML = "";

        const table = document.createElement("table");

        table.classList.add("game-board");

        for (let r = 0; r < this.rows; r++) {
            const row = document.createElement("tr");
			row.classList.add("game-tile");

            for (let c = 0; c < this.cols; c++) {
                const cell = document.createElement("td");
                cell.textContent = this.board[r][c] || "";
                cell.dataset.row = r;
                cell.dataset.col = c;
				//cell.dataset.isMine = false;
				cell.dataset.status = tile_stats.HIDDEN

				if(Math.floor(Math.random() * 15) === 0 && count < 10){
					cell.dataset.status = tile_stats.MINE_HIDDEN
					//cell.dataset.isMine = true;
					count++
				}

                row.appendChild(cell);
            }

            table.appendChild(row);
        }

        container.appendChild(table);
	
    }

    updateCell(cell) {

		//if tile is not hidden AND not flagged, dont do anything
		if(cell.dataset.status !== tile_stats.HIDDEN && cell.dataset.status !== tile_stats.FLAGGED){
			return
		}
	
		//if tile status is flagged, unflag it and set it as hidden
		if(cell.dataset.status === tile_stats.FLAGGED){
			cell.dataset.status = tile_stats.HIDDEN
		}
		//else if it is hidden, flag it
		else{
			cell.dataset.status = tile_stats.FLAGGED
			console.log(cell)
		}
    }


	openCell(cell){
		//if tile is not hidden AND not flagged, dont do anything
		if(cell.dataset.status === tile_stats.MINE_HIDDEN){
			cell.dataset.status = tile_stats.MINE
			this.gameOver();	
		}else{
			cell.dataset.status = tile_stats.NUMBER
		}

	}

	gameOver(){
		console.log("game over")
	}
}

export default GameBoard;
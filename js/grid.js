'use strict'

class Grid {
    constructor(grid, space, x, move, accumulated) {
        this.moves = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        this.grid = grid;
        this.space = space;
        this.x = x;
        this.move = move;
		this.accumulated = accumulated;
    }

    apply(move) {
        if (!this.valid(move)) return false;

        const row = Math.floor(this.x / 4) + move[0];
        const col = (this.x % 4) + move[1];
        const y = row * 4 + col;
        const val = this.grid[y];

        const x = this.x;
        const space = this.space;

        const newGrid = this.grid.map((t, i) => {
            if (i == y) return space;
            else if (i == x) return val;
            else return t;
        });

        return new Grid(newGrid, this.space, y, move, this.accumulated + this.heuristic() + 1);
    }

    done() {
        return !!this.grid.slice(0, -1).reduce((t, i) => t !== false && i >= t && i);
    }

    neighbors() {
        return this.moves.map(move => this.apply(move)).filter(m => m);
    }

	manhattanDistance(tile, index) {
		const val = tile == 0 ? 15 : (tile - 1);
		const realRow = Math.floor(val / 4);
		const realCol = val % 4;

		const row = Math.floor(index / 4);
		const col = index % 4;

		return Math.abs(row - realRow) + Math.abs(col - realCol);
	}

	heuristic() {
		return this.accumulated + this.grid.reduce((acc, curr, i) => acc + this.manhattanDistance(curr, i), 1);
	}

    valid(move) {
        const row = Math.floor(this.x / 4) + move[0];
        const col = (this.x % 4) + move[1];

        return row < 4 && row >= 0 && col < 4 && col >= 0;
    }

	equals(grid) {
		const g1 = this.grid;
		const g2 = grid.grid;

        return g1.reduce((acc, curr, i) => curr == g2[i] && acc, g1[0] == g2[0]);
	}
}

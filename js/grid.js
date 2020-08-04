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

    lastMove() {
        return this.move;
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
		return this.grid.map((t, i) => this.manhattanDistance(t, i)).reduce((a, b) => a + b + 1, 0);
	}

    valid(move) {
        const row = Math.floor(this.x / 4) + move[0];
        const col = (this.x % 4) + move[1];

        return row < 4 && row >= 0 && col < 4 && col >= 0;
    }

	getGrid() {
		return this.grid;
	}

	equals(grid) {
		if (!this.grid.grid) return false;
		if (!grid.getGrid()) return false;

		const g1 = this.grid.grid;
		const g2 = grid.getGrid();

		const a = g1[0].reduce((a, c, i) => c == g2[0][i] && a, g2[0][0] == g1[0][0]);
		const b = g1[1].reduce((a, c, i) => c == g2[1][i] && a, g2[1][0] == g1[1][0]);
		const c = g1[2].reduce((a, c, i) => c == g2[2][i] && a, g2[2][0] == g1[2][0]);
		const d = g1[3].reduce((a, c, i) => c == g2[3][i] && a, g2[3][0] == g1[3][0]);

		return a && b && c && d;
	}
}

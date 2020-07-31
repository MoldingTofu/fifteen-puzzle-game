'use strict'

class Grid {

    constructor(grid, space, x, move) {
        this.moves = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        this.grid = grid;
        this.space = space;
        this.x = x;
        this.move = move;
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

        return new Grid(newGrid, this.space, y, move);
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

    valid(move) {
        const row = Math.floor(this.x / 4) + move[0];
        const col = (this.x % 4) + move[1];

        return row < 4 && row >= 0 && col < 4 && col >= 0;
    }
}

class Solver {
    constructor(grid) {
        this.grid = grid;
    }

    solve() {
        const helpers = [this.grid];
        const ans = this.bfs(this.grid, helpers, [this.grid], []);
        return ans;
    }

    bfs(start, queue, visited, path) {
        if (!queue.length) {
            return false;
        }

        if (start.done()) {
            return [...path];
        }

        const neighbors = start.neighbors().filter(g => !visited.includes(g));
        const newQueue = [...queue].slice(1).concat(neighbors);
        return this.bfs(newQueue[0], newQueue, [...visited, newQueue[0]], [...path, newQueue[1].lastMove()]);
    }
}

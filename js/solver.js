'use strict'

class Solver {
    constructor(grid) {
        this.grid = grid;
    }

    solve() {
        //const helpers = [this.grid];
        //const ans = this.bfs(this.grid, helpers, [this.grid], []);

		const ans = this.dijkstra(this.grid, new MinHeap(this.grid, [], this.comparator), [this.grid], [this.grid]);

        return ans;
    }

    bfs(start, queue, visited, path) {
        if (!queue.length) {
            return false;
        }

        if (start.done()) {
            return [...path];
        }

        //const neighbors = start.neighbors().filter(g => !visited.includes(g));
        const neighbors = start.neighbors().filter(g => !visited.includes(g));
        const newQueue = [...queue].slice(1).concat(neighbors);
        return this.bfs(newQueue[0], newQueue, [...visited, newQueue[0]], [...path, newQueue[1].lastMove()]);
    }

	dijkstra(start, pq, visited, path) {
		if (start.done()) {
			return [...path];
		}

		console.log(visited.length);

		if (typeof(pq) == "boolean") {
			return false;
		}

		const neighbors = start.neighbors().flatMap(g => {
			if (!visited.some(v => v.equals(g))) return [g];
			else return [];
		});

		const newpq = neighbors.reduce((acc, curr) => acc.insert(curr), pq);
		const min = newpq.findMin();

		return this.dijkstra(min, newpq.deleteMin(), [...visited, min], [...path, min.lastMove()]);
	}

	comparator(a, b) {
		return a.accumulated - b.accumulated;
	}
}

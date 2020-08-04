'use strict'

class Solver {
    constructor(grid) {
        this.grid = grid;
    }

    solve() {
        //const helpers = [this.grid];
        //const ans = this.bfs(this.grid, helpers, [this.grid], []);

		const ans = this.dijkstra(this.grid, new MinHeap(null, [], this.comparator), [this.grid], [this.grid]);

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
        console.log(start.heuristic());
		if (start.done()) {
			return [...path];
		}

		if (typeof(pq) == "boolean") {
			return false;
		}

		const neighbors = start.neighbors().flatMap(g => {
			if (visited.some(v => v.equals(g))) return [];
            else return [g];
		});

		const newpq = neighbors.reduce((acc, curr) => acc.insert(curr), pq);
		const min = newpq.findMin();

		return this.dijkstra(min, newpq.deleteMin(), [...visited, min], [...path, min.move]);
	}

	comparator(a, b) {
		return a.heuristic() - b.heuristic();
	}
}

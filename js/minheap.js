'use strict'

class MinHeap {
	constructor(elem, subheaps, comparator) {
		this.elem = elem;
		this.subheaps = subheaps;
		this.comparator = comparator;
	}

	findMin() {
		return this.elem;
	}

	insert(elem) {
        if (!this.elem) return new MinHeap(elem, [], this.comparator);
		return this.meld(new MinHeap(elem, [], this.comparator), this);
	}

	deleteMin() {
		return this.mergePairs(this.subheaps);
	}

	// should be private methods

	append(subheaps, elem) {
		return subheaps.concat(new MinHeap(elem, [], this.comparator));
	}

	meld(h1, h2) {
		if (!h1) return h2;
		else if (!h2) return h1;
		else if (this.comparator(h1.elem, h2.elem) < 0) {
			const subheap = h1.subheaps.concat(this.append(h2.subheaps, h2.elem));
			return new MinHeap(h1.elem, subheap, this.comparator);
		}
		else {
			const subheap = h2.subheaps.concat(this.append(h1.subheaps, h1.elem));
			return new MinHeap(h2.elem, subheap, this.comparator);
		}
	}

	mergePairs(list) {
		if (!list.length) return false;
		else if (list.length == 1) return list[0];
		else return this.meld(this.meld(list[0], list[1]), this.mergePairs(list.slice(2)));
	}
}

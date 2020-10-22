"use strict";

class Node {
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.gCost = 0;
        this.hCost = 0;
        this.totalCost = 0;

        this.isWall = false;
        this.isOpen = false;

        this.lastNode = null;
    }

    _calculateDistances(finalNode) {
        function euclidianDistance(node1, node2) {
            const a = Math.pow(Math.abs(node2.x - node1.x), 2);
            const b = Math.pow(Math.abs(node2.y - node1.y), 2);

            const c = Math.sqrt(a + b);

            const distance = Math.floor(c * 10);
            return distance;
        }

        const lastNode = this.lastNode;

        this.gCost = euclidianDistance(this, lastNode);
        this.gCost += lastNode.gCost;

        this.hCost = euclidianDistance(this, finalNode);

        this.totalCost = this.gCost + this.hCost;

    }

    /**
     * 
     * @param {this} lastNode 
     * @param {this} finalNode 
     */
    open(lastNode, finalNode) {
        if (this.lastNode == null) {
            this.lastNode = lastNode;
            this._calculateDistances(finalNode);
        } else {

            let copyNode = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
            copyNode.lastNode = lastNode;
            copyNode._calculateDistances(finalNode);

            if (copyNode.totalCost < this.totalCost) {
                this.gCost = copyNode.gCost;
                this.hCost = copyNode.hCost;
                this.totalCost = copyNode.totalCost;
                this.lastNode = copyNode.lastNode;
            }
        }
    }
}
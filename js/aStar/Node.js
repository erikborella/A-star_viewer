"use strict";

class Node {
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
}
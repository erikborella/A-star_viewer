"use strict";

class AStar {
    /**
     * 
     * @param {Number} hSize 
     * @param {Number} vSize 
     * @param {JSON} initialNodePosition 
     * @param {JSON} finalNodePosition 
     */
    constructor(hSize, vSize, initialNodePosition, finalNodePosition) {
        this.board = this._generateBoard(hSize, vSize);
        this.initialNode = this.board[initialNodePosition.y][initialNodePosition.x];
        this.finalNode = this.board[finalNodePosition.y][finalNodePosition.x];

        this.stepMark = "sn-i";
        this.workingNode = null;
    }
    
    /**
     * 
     * @param {Number} hSize 
     * @param {Number} vSize 
     */
    _generateBoard(hSize, vSize) {
        let board = new Array(vSize);

        for (let y = 0; y < vSize; y++) {
            board[y] = new Array(hSize);
            for (let x = 0; x < hSize; x++) {
                board[y][x] = new Node(x, y);
            }
        }

        return board;
    }

    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    _isBoardPositionValid(x, y) {
        const xBoardSize = this.board[0].length;
        const yBoardSize = this.board.length;

        return (x >= 0 && x < xBoardSize && y >= 0 && y < yBoardSize);
    }

    /**
     * 
     * @param {Node} node 
     */
    openAdjacentNodes(node) {
        node.isOpen = true;

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {

                if ((i != 0 || j != 0) && 
                this._isBoardPositionValid(node.x + j, node.y + i)) {

                    const nextNode = this.board[node.y + i][node.x + j];

                    if (!nextNode.isWall && !nextNode.isOpen) {
                        nextNode.open(node, this.finalNode);
                    }
                }
            }
        }
    }

    findNodeMinorCost() {
        let minorCostNode = null;
        
        const xBoardSize = this.board[0].length;
        const yBoardSize = this.board.length;

        for (let i = 0; i < yBoardSize; i++) {
            for (let j = 0; j < xBoardSize; j++) {
                let node = this.board[i][j];

                if (!node.isWall && !node.isOpen && node.lastNode != null) {
                    if (minorCostNode == null) {
                        minorCostNode = node;
                    } else {
                        if (node.totalCost < minorCostNode.totalCost) {
                            minorCostNode = node;
                        }
                    }
                }
            }
        }

        return minorCostNode;
    }

    isFinalAdjacent(node) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if ((i != 0 || j != 0) &&
                this._isBoardPositionValid(node.x + j, node.y + i)) {
                    const nextNode = this.board[node.y + i][node.x + j];

                    if (nextNode == this.finalNode) {
                        this.finalNode.lastNode = node;
                        return true;
                    }
                }
            }
        }
        return false;
    }

    _getPathToInitial(node) {
        let path = [];

        while (node != this.initialNode) {
            path.push(node);
            node = node.lastNode;
        }

        return path;
    }

    _getPrePaths() {
        const minorCostNode = this.findNodeMinorCost();
        let minorsNodes = [];

        const xBoardSize = this.board[0].length;
        const yBoardSize = this.board.length;

        for (let i = 0; i < yBoardSize; i++) {
            for (let j = 0; j < xBoardSize; j++) {
                if (this.board[i][j].totalCost == minorCostNode.totalCost) {
                    minorsNodes.push(this.board[i][j]);
                }
            }
        }

        let paths = [];

        for (let i = 0; i < minorsNodes.length; i++) {
            paths.push(this._getPathToInitial(minorsNodes[i]));
        }

        return paths;
    }

    getPath() {
        if (this.finalNode.lastNode == null) {
            return this._getPrePaths();    
        } else {
            return this._getPathToInitial(this.finalNode);
        }
    }

    step() {
        switch (this.stepMark) {
            case "sn-i":
                this.workingNode = this.initialNode;
                this.stepMark = "on";
                return {'name': 'sn-i'};

            case "on":
                this.openAdjacentNodes(this.workingNode);
                this.stepMark = "cfa";
                return {'name': 'on', 'status': {'of': this.workingNode}};

            case "cfa":
                const status = this.isFinalAdjacent(this.workingNode);
                this.stepMark = (status) ? "end":"fmn";
                return {'name': 'cfa', 'status': status};

            case "fmn":
                const node = this.findNodeMinorCost();
                this.workingNode = node;
                this.stepMark = "on";
                return {'name': 'fmn', 'status': node};

            case "end":
                return {'name': 'end', 'status': 'end'};
        }
    }
}
"use strict";

class Drawer {

    /**
     * 
     * @param {AStar} aStar 
     */
    constructor(aStar, elementId) {
        this.c = document.getElementById(elementId);
        this.context = this.c.getContext('2d');
        
        this.aStar = aStar;

        this.w = this.c.width;
        this.h = this.c.height;

        this.vSize = aStar.board.length;
        this.sqrH = this.h / this.vSize;

        this.viewMode = 'n';
    }

    updateSize() {
        this.aStar = aStar;

        this.vSize = aStar.board.length;
        this.sqrH = this.h / this.vSize;
    }

    setViewMode(viewMode) {
        if (viewMode == 'n' || viewMode == 'h' || viewMode == 'g' || viewMode == 't' || viewMode == 'd') {
            this.viewMode = viewMode;
        } 
    }

    _fillNode(node, color, text = null) {
        const x = node.x;
        const y = node.y

        const drawX = x * this.sqrH;
        const drawY = y * this.sqrH;

        this.context.fillStyle = color;

        this.context.fillRect(drawX, drawY, this.sqrH, this.sqrH);
        this.context.strokeRect(drawX, drawY, this.sqrH, this.sqrH);
        

        if (text != null) {
            text = String(text);
            this.context.fillStyle = 'black';
            this.context.font = `${this.sqrH / (text.length)}px Arial`
            this.context.textAlign='center';
            this.context.fillText(text, (x * this.sqrH) + this.sqrH / 2, (y * this.sqrH) + this.sqrH * 6/7);
        }
        
    }

    _getLastNodeDirection(node) {
        if (node.lastNode == null) {
            return '-';
        }

        const lastNode = node.lastNode;

        const xDir = lastNode.x - node.x + 1;
        const yDir = lastNode.y - node.y + 1;

        const directionsMatrix = [
            ['2196', '2B06', '2197'],
            ['2B05', '2D', '27A1'],
            ['2199', '2B07', '2198'],
        ];

        return String.fromCharCode(parseInt(directionsMatrix[yDir][xDir], 16));
    }

    _getViewValue(node) {
        switch(this.viewMode) {
            case 'n':
                return '';
            case 'h':
                return node.hCost;
            case 'g':
                return node.gCost;
            case 't':
                return node.totalCost;
            case 'd':
                return this._getLastNodeDirection(node);
        }
    }

    drawGrids() {
        this.context.clearRect(0, 0, this.w, this.h);
        
        for (let y = 0; y < this.vSize; y++) {
            for (let x = 0; x < this.vSize * this.w / this.h; x++) {
                this.context.strokeRect(x * this.sqrH, y * this.sqrH, this.sqrH, this.sqrH);
            }
        }
    }

    drawFixedPoints() {
        for (let y = 0; y < this.vSize; y++) {
            for (let x = 0; x < this.vSize * this.w / this.h; x++) {

                const node = this.aStar.board[y][x];

                if (node == this.aStar.initialNode) {
                    this._fillNode(node, '#72bcd4', 'I');
                } else if (node == this.aStar.finalNode) {
                    this._fillNode(node, '#72bcd4', 'F');
                } else if (node.isWall) {    
                    this._fillNode(node, 'black')
                }

            }
        }
    }

    drawOpenNode(node) {

        if (node != this.aStar.initialNode) {
            this._fillNode(node, 'red', this._getViewValue(node));
        }

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {

                if ((i != 0 || j != 0) && 
                this.aStar._isBoardPositionValid(node.x + j, node.y + i)) {

                    const nextNode = this.aStar.board[node.y + i][node.x + j];

                    if (!nextNode.isOpen && !nextNode.isWall && nextNode != this.aStar.finalNode) {
                        this._fillNode(nextNode, 'green', this._getViewValue(nextNode));
                    }
                }

            }
        }

    }

    drawPathIfComplete() {
        if (this.aStar.stepMark == 'end') {
            const path = this.aStar.getPath();

            for (let i = 1; i < path.length; i++) {
                this._fillNode(path[i], '#72bcd4', this._getViewValue(path[i]));
            }
        }
    }

    redraw() {
        this.context.clearRect(0, 0, this.w, this.h);
        
        for (let y = 0; y < this.vSize; y++) {
            for (let x = 0; x < this.vSize * this.w / this.h; x++) {
                const node = this.aStar.board[y][x];

                this.context.strokeRect(x * this.sqrH, y * this.sqrH, this.sqrH, this.sqrH);
                

                if (node == this.aStar.initialNode) {
                    this._fillNode(node, '#72bcd4', 'I');
                } else if (node == this.aStar.finalNode) {
                    this._fillNode(node, '#72bcd4', 'F');
                } else if (node.isWall) {
                    this._fillNode(node, 'black');
                } else if (node.isOpen) {
                    this.drawOpenNode(node);
                }
            }
        }

    }

    getClickedNode(pageX, pageY) {
        let x = Math.floor((pageX - this.c.offsetLeft) / this.sqrH);
        let y = Math.floor((pageY - this.c.offsetTop) / this.sqrH);

        if (x < 0) {
            x = 0
        } else if (x > this.aStar.board[0].length - 1) {
            x = this.aStar.board[0].length - 1;
        }

        if (y < 0) {
            y = 0
        } else if (y > this.aStar.board.length - 1) {
            y = this.aStar.board.length - 1;
        }
    
        return this.aStar.board[y][x];        
    }

}
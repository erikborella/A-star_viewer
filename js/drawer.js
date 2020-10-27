"use strict";

let c = document.getElementById("screenCanvas");

function fillNode(context, node, sqrH, color, text = null) {
    const padding = 0;

    const x = node.x;
    const y = node.y;    

    const drawX = x * sqrH;
    const drawY = y * sqrH;

    const paddingX = sqrH;
    const paddingY = sqrH;
    
    context.fillStyle = color;

    context.fillRect(drawX, drawY, paddingX, paddingY);

    if (text != null) {
        text = String(text);
        context.fillStyle='black';
        context.font=`${sqrH / (text.length)}px Arial`;
        context.textAlign='center';
        context.fillText(text, (x * sqrH) + sqrH / 2, (y * sqrH) + sqrH * 6/7);
    }
}

// context.fillText(text, drawX + sqrH / 2, drawY + sqrH * 6/7, sqrH);

/**
 * 
 * @param {AStar} aStar 
 */
function draw(aStar) {
    let context = c.getContext('2d');

    const w = c.width;
    const h = c.height;

    context.clearRect(0, 0, w, h);
    
    const vSize = aStar.board.length;
    const sqrH = h / vSize;
            
    for(let y = 0; y < vSize; y++) {
        for (let x = 0; x < vSize * w / h; x++) {
            const node = aStar.board[y][x];

            context.strokeRect(x * sqrH, y * sqrH, sqrH, sqrH);

            if (node == aStar.initialNode) {
                fillNode(context, node, sqrH, '#72bcd4', 'I');
            } else if (node == aStar.finalNode) {
                fillNode(context, node, sqrH, '#72bcd4', 'F');
            } else if (node.isWall) {
                fillNode(context, node, sqrH, 'black');
            } else if (node.isOpen) {
                fillNode(context, node, sqrH, 'red', node.totalCost);
            } else if (node.totalCost != 0) {
                fillNode(context, node, sqrH, 'green', node.totalCost);
            }

        }
    }    
}
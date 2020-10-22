"use strict";

function draw(vSize) {
    let c = document.getElementById("screenCanvas");
    let context = c.getContext('2d');

    const w = c.width;
    const h = c.height;

    context.clearRect(0, 0, w, h);
    
    const sqrH = h / vSize;
            
    for(let y = 0; y < vSize; y++) {
        for (let x = 0; x < vSize * w / h; x++) {
            context.strokeRect(x * sqrH, y * sqrH, sqrH, sqrH);
        }
    }    
}
"use strict";

let logText = "";
let isEditModeOn = false;
let aStar;

let stepsPerSecond = 1;
let stepper = null;

let drawer;

let isLogModeOn = false;
let logCount = 0;

const MAX_LOG_MESSAGES = 10;

$(document).ready(function() {
    $('.tooltipped').tooltip();
    $("#continuousControls").hide();
    $("#editModeDiv").hide();

    init();
});

$("#switchControls").change(function() {
    let useContinuous = $(this).prop("checked");

    if (useContinuous) {
        $("#stepControls").hide();
        $("#continuousControls").show();
    } else {
        $("#stepControls").show();
        $("#continuousControls").hide();
    }
});

$("#switchEditMode").change(function() {
    let editMode = $(this).prop("checked");
    isEditModeOn = editMode;
    
    if (editMode) {
        $("#editModeDiv").show();
        $("#runModeDiv").hide();
    } else {
        $("#editModeDiv").hide();
        $("#runModeDiv").show();
    }
});

$("#switchUseLog").change(function() {
    isLogModeOn = $(this).prop("checked");

    if (!isLogModeOn) {
        clearLogText();
    }
});

$("#continuousStepsRange").change(function() {
    stepsPerSecond = $(this).val();
    stepsPerSecond = parseFloat(stepsPerSecond);

    if (stepper != null) {
        stopAStar();
        runAStar();
    }
});

$("#nextStepButton").click(function() {
    stepAStar();
});

$("#runStepperButton").click(function() {
    runAStar();
})

$("#stopStepperButton").click(function() {
    stopAStar();
});

$("#resetAStarButton").click(function() {
    stopAStar();

    aStar.reset();
    drawer.redraw();

    clearLogText();
});

$("#viewsModeForm input").change(function() {
    const viewMode = $('input[name="viewsModeGroup"]:checked').val();
    drawer.setViewMode(viewMode);
    drawer.redraw();
    drawer.drawPathIfComplete();
});

$("#generateWallsButton").click(function() {
    let wallsPercentage = $("#percentageRandomGeneratorInput").val();

    if (wallsPercentage < 0 || wallsPercentage > 50) {
        M.toast({html: 'Invalid percentage number'});
        return;
    }

    wallsPercentage /= 100;    

    const vSize = aStar.board.length;
    const hSize = aStar.board[0].length;

    const wallsNumber = (vSize * hSize) * wallsPercentage;
    
    aStar.erase();

    for (let wallsCount = 0; wallsCount < wallsNumber; wallsCount++) {
        let x, y;

        do {
            x = Math.floor(Math.random() * hSize);
            y = Math.floor(Math.random() * vSize);
        } while (aStar.board[y][x].isWall || 
            aStar.board[y][x] == aStar.initialNode || 
            aStar.board[y][x] == aStar.finalNode);

        aStar.board[y][x].isWall = true;

    }

    drawer.redraw();
});

$("#screenCanvas").click(function(event) {
    if (isEditModeOn) {
        if (aStar.stepMark != 'sn-i') {
            aStar.reset();
        }

        const editMode = $('input[name="editorNodeGroup"]:checked').val();
        const node = drawer.getClickedNode(event.pageX, event.pageY);

        if (editMode == "i") {
            aStar.initialNode = node;
        } else if (editMode == "f") {
            aStar.finalNode = node;
        } else if (editMode == "w") {
            node.isWall = !node.isWall;
        }

        drawer.redraw();
    }
});


function init() {
    aStar = new AStar(20, 10, {x: 0, y: 4}, {x: 19, y: 9});

    drawer = new Drawer(aStar, "screenCanvas");
    drawer.setViewMode('d');

    drawer.drawGrids();
    drawer.drawFixedPoints();
}

function logStep(status) {
    switch (status.name) {
        case "sn-i":
            logText = logText.replace(/^/, `Setting initial node as working node\n\n`);
            break;

        case "on":
            logText = logText.replace(/^/, `Opening adjacents nodes\n\n`);
            break;

        case "cfa":
            logText = logText.replace(/^/, `Checking if final node is adjcent\n` + 
            `status: ${(status.status) ? "found":"not found"}\n\n`);
            break;

        case "fmn":
            if (status.status == null) {
                logText = logText.replace(/^/, `Searching for best node\nNot found\n\n`);
            } else {
                const x = status.status.x;
                const y = status.status.y;
                logText = logText.replace(/^/, `Searching for best node\nfound at: x=${x} y=${y}\n\n`);
            }
            break;
        
        case "end":
            logText = logText.replace(/^/, `End\n\n`);
            break;

        case "end-ns":
            logText = logText.replace(/^/, `No solution found\n\n`);
            break;
    }

    setLogText();
}

function stepAStar() {
    let status;

    if (isLogModeOn) {
        status = aStar.step();
        logStep(status);
    } else {
        status = aStar.step();
        while (status.name != "on" && status.name != "end" && status.name != "end-ns") {
            status = aStar.step();
        }
    }

    if (status.name == "on") {
        drawer.drawOpenNode(status.status.of);
    }
        
    if (status.name == "end" || status.name == "end-ns") {
        stopAStar();
        drawer.drawPathIfComplete();
    }

}

function runAStar() {
    if (stepper == null) {
        stepper = setInterval(() => {
            stepAStar();
        }, 1000 / stepsPerSecond);
    }
}

function stopAStar() {
    if (stepper != null) {
        clearInterval(stepper);
        stepper = null;
    }
}

function setLogText() {
    if (logCount == MAX_LOG_MESSAGES) {
        logText = "";
        logCount = 0;
    }

    $("#logTextarea").text(logText);
    logCount++;
    M.textareaAutoResize($('#logTextarea'));
}

function clearLogText() {
    logText = "";
    setLogText();
}
"use strict";

let logText = "";
let isEditModeOn = false;
let aStar;

let stepsPerSecond = 1;
let stepper = null;

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

    const initialNodePosition = {
        x: aStar.initialNode.x,
        y: aStar.initialNode.y,
    };
    const finalNodePosition = {
        x: aStar.finalNode.x,
        y: aStar.finalNode.y,
    };

    aStar = new AStar(20, 10, initialNodePosition, finalNodePosition);

    logText = "";
    setLogText();
});

function init() {
    aStar = new AStar(20, 10, {x: 0, y: 4}, {x: 19, y: 9});
    draw(aStar);
}

function stepAStar() {
    const status = aStar.step();

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
            const x = status.status.x;
            const y = status.status.y;
            logText = logText.replace(/^/, `Searching for best node\nfound at: x=${x} y=${y}\n\n`);
            break;
        
        case "end":
            logText = logText.replace(/^/, `End\n\n`);
            stopAStar();
            break;
    }

    setLogText();
}

function runAStar() {
    stepper = setInterval(() => {
        stepAStar();
    }, 1000 / stepsPerSecond);
}

function stopAStar() {
    if (stepper != null) {
        clearInterval(stepper);
        stepper = null;
    }
}

function setLogText() {
    $("#logTextarea").text(logText);
    M.textareaAutoResize($('#logTextarea'));
}
"use strict";

let logText = "";
let isEditModeOn = false;
let aStar;

let stepsPerSecond = 1;
let stepper = null;

let drawer;

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

    aStar.reset();
    drawer.redraw();
});

function init() {
    aStar = new AStar(20, 10, {x: 0, y: 4}, {x: 19, y: 9});
    drawer = new Drawer(aStar, "screenCanvas");

    drawer.drawGrids();
    drawer.drawFixedPoints();
}

function stepAStar() {
    const status = aStar.step();

    if (status.name == "on") {
        drawer.drawOpenNode(status.status.of);
    }

    if (status.name == "end") {
        stopAStar();
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
    $("#logTextarea").text(logText);
    M.textareaAutoResize($('#logTextarea'));
}
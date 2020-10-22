"use strict";

let isEditModeOn = false;
let aStar;

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

function init() {
    aStar = new AStar(20, 10, {x: 0, y: 4}, {x: 19, y: 9});
    draw(10);
}
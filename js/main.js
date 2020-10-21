"use strict";

let isEditModeOn = false;

$(document).ready(function() {
    $('.tooltipped').tooltip();
    $("#continuousControls").hide();
    $("#editModeDiv").hide();
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
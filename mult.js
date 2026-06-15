/*
File: mult.js
GUI Assignment: Creating an Interactive Dynamic Table
James Bord, UMass Lowell Computer Science, james_bord@student.uml.edu
Copyright (c) 2021 by Bord. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
updated by JB on June 8, 2026
*/

function two_way_link_slider_input(sliderId, inputId) {

    $(sliderId).slider({
        min: -100,
        max: 100,

        // actual act of updating the text box. The change event is 
        // necesary to remind JQuery to validate the form.
        slide: function(event, ui) {
            $(inputId).val(ui.value).trigger("change");
        }
    });

    // Update the slider on typing in the textbox as wel.
    $(inputId).on("input", function() {
        $(sliderId).slider(
            "value",
            Number($(this).val())
        );
    });
}


// main function of the application, generates the table
function generate_multiplication_table(x_min, x_max, y_min, y_max) {

    // PROGRAM EXECUTION

    // aquire handle for the table container
    const table_cont = document.getElementById("table-container");

    // empty the table container and error container for resubmissions or resolved errors
    table_cont.innerHTML = "";

    // make a table with a nice border
    const table = document.createElement("table");
    table.style.border = "2px solid black";


    // make header row using th elements for clarity
    const header_row = table.insertRow();
    // make the right hand box and corner of the table a header box with the multiplication symbol
    const empty_cell = document.createElement("th");
    empty_cell.innerHTML = "✖️";
    header_row.appendChild(empty_cell);

    // Fill the header row with the row range
    for(let j = x_min; j <= x_max; j++) {
        const header_cell = document.createElement("th");
        header_cell.innerHTML = String(j);
        header_row.appendChild(header_cell);
    }

    // Process columns
    for(let i = y_min; i <= y_max; i++) {

        // fill the header column with the column range
        const row = table.insertRow();
        const header_cell = document.createElement("th");
        header_cell.innerHTML = String(i);
        row.appendChild(header_cell);

        // fill the rest of the column with the actual multiplication results
        for(let j = x_min; j <= x_max; j++) {
            const cell = row.insertCell();
            cell.innerHTML = String(i * j);
        }
    }

    // Display the table
    table_cont.appendChild(table);
}





// Block that executes once the page is fully loaded.
$(document).ready(function() {

    // Add cusom method to evaluate less than or equal conditions
    $.validator.addMethod(
        "lessThanOrEqual",
        function(value, element, param) {
            return Number(value) <= Number($(param).val());
        },
        "Invalid range. Min is greater than max."
    );

    // Add custom method to check if the range is <= 301 numbers
    $.validator.addMethod(
        "rangeSize",
        function(value, element, params) {
            const min = Number($(params[0]).val());
            const max = Number($(params[1]).val());

            return (max - min) <= 301;
        },
        "Range cannot exceed 301 numbers."
    );

    $.validator.addMethod(
        "integer",
        function(value, element, param) {
            return !value.includes('.');
        },
        "Value must be an integer."
    );

    // Establish rules for each field.
    $("#mult-form").validate({

        // all fields are requried and numbers.
        // Minimums require themselves to be less than or equal to the maximums
        // Maximums require themselves to be 301 numbers or less form the minimums
        rules: {
            min_x: {
                required: true,
                number: true,
                lessThanOrEqual: "#max-x",
                integer: true
            },

            max_x: {
                required: true,
                number: true,
                rangeSize: ["#min-x", "#max-x"],
                integer: true
            },

            min_y: {
                required: true,
                number: true,
                lessThanOrEqual: "#max-y",
                integer: true
            },

            max_y: {
                required: true,
                number: true,
                rangeSize: ["#min-y", "#max-y"],
                integer: true
            }
        },

        // Custom error messages
        messages: {
            min_x: {
                required: "Please enter a row minimum.",
                number: "Please enter a valid number.",
                lessThanOrEqual: "Your row minimum must be less than or equal to your row maximum.",
            },

            min_y: {
                required: "Please enter a column minimum.",
                number: "Please enter a valid number.",
                lessThanOrEqual: "Your column minimum must be less than or equal to your column maximum.",
            },

            max_x: {
                required: "Please enter a row maximum.",
                number: "Please enter a valid number.",
                rangeSize: "Row range cannot exceed 301 numbers."
            },

            max_y: {
                required: "Please enter a row maximum.",
                number: "Please enter a valid number.",
                rangeSize: "Column range cannot exceed 301 numbers."
            }
        },

        // original submit onclick but made cleaner by jquery
        submitHandler: function(form) {

            add_tab();

            return false;
        }
    });

    $("#min-x, #max-x, #min-y, #max-y").on(
        "input change",
        function(form) {
            if (!$("#mult-form").valid())
                return;

            const x_min = Number($("#min-x").val());
            const x_max = Number($("#max-x").val());
            const y_min = Number($("#min-y").val());
            const y_max = Number($("#max-y").val());

            generate_multiplication_table(
                x_min,
                x_max,
                y_min,
                y_max
            );
        }
    );

    // Make all the slider class divs into UI sliders
    two_way_link_slider_input("#min-x-s", "#min-x");
    two_way_link_slider_input("#max-x-s", "#max-x");
    two_way_link_slider_input("#min-y-s", "#min-y");
    two_way_link_slider_input("#max-y-s", "#max-y");

    
    // Build an initial table
    const x_min = Number($("#min-x").val());
    const x_max = Number($("#max-x").val());
    const y_min = Number($("#min-y").val());
    const y_max = Number($("#max-y").val());

    generate_multiplication_table(
        x_min,
        x_max,
        y_min,
        y_max
    );

    $("#tabs").tabs();
});


let tab_count = 0;

function add_tab() {
    const index = tab_count++;

    const id = "tab-" + index;
    const title = "Table " + index;

    //Create real panel element
    const panel = document.createElement("div");
    panel.id = id;
    panel.className = "tabs-panel"

    const li_id = "tab-link-" + index;
    const but_id = "del-button-" + index;

    //Put table HTML inside it
    panel.innerHTML = document.getElementById("table-container").innerHTML;

    //Add tab button
    $("#tabs ul").append(
        `<li id="${li_id}"><a href="#${id}">${title}</a>
        <button class="x-button" id="${but_id}">x</button></li>`
    );

    //Add panel properly
    $("#tabs").append(panel);

    //Add a event handler to the button
    $("#" + but_id).on("click", function() {
        deleteTab(index);
    });

    //Refresh jQuery UI
    $("#tabs").tabs("refresh");
}

function deleteTab(index) {
    $("#tab-" + index).remove();
    $("#tab-link-" + index).remove();
    $("#tabs").tabs("refresh");
}
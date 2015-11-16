// An MVC implementation of webpage that taps the Google Sheets API
// for interaction with a single, predefined spreadsheet.  Front end
// is a basic Bootstrap website from template.
//
// Author: Cole Howard (sorta also Patrick and Connor)
//

;  // Defensive

function Wrapper() {

    'use strict';

    var Model = {
        url: "https://spreadsheets.google.com/feeds/cells/" +
              "1sYkU_8raV14Bqm33dWcaksC3iMm73DH9OMsooxSMItM" +
              "/od6/public/values?alt=json",
        currentState: {},

        getModel: function(callback) {
            var self = this;
            $.getJSON(this.url, function(data) {
                var col_high = 0;
                $.each(data.feed.entry, function(key, value) {
                    var cur_col = Number(value.gs$cell.col);  //Returns column value
                    if (cur_col > col_high) {
                        col_high = cur_col; //reset the value as we iterate
                        self.currentState[(cur_col).toString()] = {};
                    }
                    self.currentState[value.gs$cell.col][value.gs$cell.row] = value.gs$cell.$t;
                }); // End .each
                callback();
            });
        },

        appendLine: function(data) {
            var to_post = {};
            $.each(data, function(k, v) {
                to_post[Model.currentState[k]["1"]] = v;
            });
            var address = "https://sheetsu.com/apis/0a299348";
            $.post(address, to_post, Controller.fetchData);
        },

        updateModel: function() {
            // may not be necessary?
        },
        nonFunc : function() {
            // Does nothing (a dummy callback for the initialization fo the model)
        }
    };

    var Controller = {
        
        fetchData : function() {

            Model.getModel(function() {
                document.getElementById("addrow").disabled = false;
                View.drawTable(Model.currentState);
            });
        },

        updateData : function(pos_str) {
            
            Model.setData(data, position);
            Model.getModel();              // BE MORE DEFENSIVE GWRAHHH!
            return Model.currentState;
        },

        eventHandler : function(e) {
            // If Add Button is clicked
            if (e.target.className === "adder") {
                $(e.target).prop("disabled",true);
                View.displayAdd();

            // For Future functionality
            // // If Delete Button is clicked
            // } else if (e.target.className === "del") {
            //     this.updateData(null, e.target.position);

            // // If A Cell is Updated
            // } else if (e.target.className === "data") {
            //     this.updateData(e.target.id);

            } else if (e.target.className === "sub") {
                var addList = [];
                var input = $('.add_box').val();
                var adds = input.split(',');
                for (var i = 0; i < adds.length; i++) { // this is an issue we need to fix
                    addList.push($.trim(adds[i]));
                }
                Model.appendLine(adds);
                View.removeAdd();
                View.displayList();
            } else if (e.target.className === "update") {
                return this.fetchData();
            }
        }
    };


    var View = {
        table: $('table'),
        rowmax: 0,
        colmax: 0,
        addform: $('#addrowform'),

        drawTable: function(data) {
            this.rowmax = 0;
            this.colmax = 0;  // WTF DRY MUCH?
            $("tbody").remove();
            this.getMax(data);
            this.createTable(data);
        },


        getMax: function(data) {
            //cycles through the Model and saves number of rows and columns
            for (var i = 0;i < Object.keys(data).length; i++){
                if(Object.keys(data)[i] > this.colmax) {
                    this.colmax = Number(Object.keys(data)[i]);
                }
            }
            for (var key in data){
                var values = data[key];
                for (var j = 0; j < Object.keys(values).length; j++) {
                    if(Number(Object.keys(values)[j]) > this.rowmax) {
                        this.rowmax =  Number(Object.keys(values)[j]);
                    }
                }
            }
        },

        createTable: function(data) {
            //creates a table with the dimensions of rowmax and colmax
            for (var r = 1; r <= this.rowmax; r++) {
                var tr = this.table[0].insertRow(-1);
                for (var c = 1; c <= this.colmax; c++) {
                    var cell = tr.insertCell(-1);
                    cell.setAttribute("id", r + ',' + c);
                    this.populateCell(data, r, c, cell);
                }
            }
        },

        populateCell: function(data, r, c, cell) {
            //fills each cell with its corresponding text, empty ojbects are filled with placeholder text to maintain table shape
            if (data[c] && data[c][r]) {
                cell.innerHTML = data[c][r];
            }
            else {
                cell.innerHTML = '&nbsp';
            }   
        },

        addNewRow: function() {
            //appends a row of text boxes to bottom of the table to pass to Controller
            var tr = this.table[0].insertRow(this.rowmax);
            for (var c = 1; c <= this.colmax; c++) {
                var cell = tr.insertCell(-1);
                cell.setAttribute("id", (c));
                cell.innerHTML = '<input type="text">';
            }
        },

        addDone: function() {
            var sendData = {};
            //creates a Submit button to send to Controller
            var $done = $('<input type="submit" value="Done" id="donebutton" class="btn btn-default" />');
            var text = $(":text");
            $done.appendTo(this.addform); 
            $(":submit").click(function() {
                event.preventDefault();
                for (var k = 0; k < $(":text").length; k++) {
                    sendData[$(":text")[k].parentNode.getAttribute("id")] = $(":text")[k].value;
                    $done.remove();
                }
            console.log(sendData);
            Model.appendLine(sendData);

            //Controller.something?
            });                     
        }
    };

    
    Controller.fetchData();



    $("#addrow").click(function() {
        document.getElementById("addrow").disabled = true;
        View.addNewRow();
        View.addDone();
    });

}
 
Wrapper();

$('#donebutton').on('click', function () {
    var $btn = $(this).button('loading')
    // business logic...
    $btn.button('reset')
  });






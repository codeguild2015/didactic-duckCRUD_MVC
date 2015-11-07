// An MVC implementation of webpage that taps the Google Sheets API
// for interaction with a single, predefined spreadsheet.  Front end
// is a basic Bootstrap website from template.
//
// Author: Cole Howard
//

;  // Defensive

function Wrapper() {

    'use strict';

    var Model = {

        // Array of arrays (the rows)
        currentState : [],

        getModel : function() {
            // Also from Connor

            Model.currentState = [];
            var url = "https://spreadsheets.google.com/feeds/cells/1sYkU_8raV14Bqm33dWcaksC3iMm73DH9OMsooxSMItM/od6/public/values?alt=json";
             $.getJSON( url, function(data) {
                var tempRow = [];
                var currentRowNum = 0;
                for (var i = 0; i < data.feed.entry.length; i++){
                   var row = data.feed.entry[i].gs$cell.row;
                   var col = data.feed.entry[i].gs$cell.col;
                   var txt = data.feed.entry[i].gs$cell.$t;
                   if (parseInt(row) > currentRowNum) {
                        Model.currentState.push(tempRow);
                        tempRow = [];
                        currentRowNum = parseInt(row);
                        tempRow.push(txt);
                    } else {
                        tempRow.push(txt);
                    }
            }
            Model.currentState.push(tempRow);
            return Model.currentState;
        });
         },
    
 


        setData : function(val, position) {
            // 
        }

    };

    var Controller = {
        modelStatus : "old",
        fetchData : function() {
            View.displayList();
           return Model.getModel();
        },

        updateData : function(data, position) {
            Model.setData(data, position);
            Model.getModel();
            return Model.currentState;
        },

        eventHandler : function(e) {
            // If Add Button is clicked
            if (e.target.className === "adder") {
                this.updateData(data, end_of_list);

            // If Delete Button is clicked
            } else if (e.target.className === "del") {
                this.updateData(null, e.target.position);

            // If A Cell is Updated
            } else if (e.target.className === "data") {
                this.updateData(val, e.target.position);

            }
            // Should return new copy of model after any button click.
            console.log(Model.currentState);
            return this.fetchData();
        }


    };


    var View = {
        mainLocale : $(".starter-template"),
        datList : $(".data"),
        drawDisplay : function() {
            // Add event listner

            this.mainLocale.append("<h3>Current Spreadsheet Data</h3>");
            this.mainLocale.append("<ul class='data'></ul>");
            this.mainLocale.append("<button class='adder'>Add Item</button>");
            this.mainLocale.append("<button class='del'>Delete</button>");
            this.mainLocale.append("<button class='update'>Fetch Newest Info</button>");

            this.mainLocale.click(function(e) {
                Controller.eventHandler(e);
            });
        },        

        // Draw list
        displayList : function() {
            // From Conner and Dana
            var table = $('table');
            var tabrow = document.getElementsByTagName('tr');
            var tabdat = document.getElementsByTagName('td');
            for (var i = 0; i < Model.currentState.length; i++) {
                for (var j = 0; j < Model.currentState[i].length; j++) {
                    if (!tabrow[i-1]) {
                        var createrow = table[0].insertRow(-1); //insertRow could be (row-1) for exact index instead of last position
                        var cell = createrow.insertCell(-1);
                        cell.setAttribute("id", i + "-" + j);
                        cell.setAttribute("class", "no-select");
                        cell.innerHTML = Model.currentState[i][j];
                      } else {
                          var newcell = tabrow[i-1].insertCell(-1); //insertCell could be (col-1) for exact index instead of last position
                          newcell.innerHTML = Model.currentState[i][j];
                          newcell.setAttribute("id", i + "-" + j);
                          newcell.setAttribute("class", "no-select");
             }

        }

    }
}
};

Controller.fetchData();
View.drawDisplay();






}


Wrapper();

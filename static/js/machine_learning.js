// ################################################################################################ //
//                                       RESOURCE TABLE ANALYSIS
// ################################################################################################ //

// *************************************
// GRANIM.JS
// *************************************
var granimInstance = new Granim({
  element: "#canvas-interactive",
  name: "interactive-gradient",
  elToSetClassOn: ".canvas-interactive-wrapper",
  direction: "diagonal",
  isPausedWhenNotInView: true,
  stateTransitionSpeed: 500,
  states: {
    "default-state": {
      gradients: [
        ["#B3FFAB", "#12FFF7"],
        ["#ADD100", "#7B920A"],
        ["#1A2980", "#26D0CE"],
      ],
      transitionSpeed: 10000,
    },
    "violet-state": {
      gradients: [
        ["#9D50BB", "#6E48AA"],
        ["#4776E6", "#8E54E9"],
      ],
      transitionSpeed: 2000,
    },
    "orange-state": {
      gradients: [["#FF4E50", "#F9D423"]],
      loop: false,
    },
  },
});

// ************************************************************************************************

// ************************************************************************************************
// Select the button
// var button = d3.select(".btn");

// Create event handlers for clicking the button or pressing the enter key
// button.on("click", runEnter);

// function runEnter() {
//   // Prevent the page from refreshing
//   d3.event.preventDefault();

//   var bedrooms = d3.select("#inputbedrooms").node().value;
//   console.log(bedrooms);

//   // var bedrooms = d3.select("#rangeval_bed").text();
//   // console.log(bedrooms);

//   // var bathrooms = d3.select("#rangeval_bath").text();
//   // console.log(bathrooms);

//   // var landArea = d3.select("#rangeval_land").text();
//   // console.log(landArea);

//   // var floorArea = d3.select("#rangeval_floor").text();
//   // console.log(floorArea);

//   // var cbdDist = d3.select("#rangeval_cbd").text();
//   // console.log(cbdDist);

//   // var yearBuilt = d3.select(".form-control_built").property("value");
//   // console.log(yearBuilt);

//   // var yearSold = d3.select(".form-control_sold").property("value");
//   // console.log(yearSold);
// }
// // d3.json(
// //   `/predict/${bedrooms}/${bathrooms}/${landArea}/${floorArea}/${cbdDist}/${yearBuilt}/${yearSold}`
// // )
// //   .then((data) => {
// //     console.log("Prediction: " + data);
// //   })
// //   .catch(function (error) {
// //     console.log(error);
// //   });

d3.json("/modelerror")
  .then((modelData) => {
    console.log(modelData);
    var table = [];

    // Create a table of 20 rows of my source data
    for (var i = 0; i < 6; i++) {
      table.push(modelData[i]);
    }

    // Using Tabulator library to show the content of my resource
    new Tabulator("#resource-table", {
      data: table, //assign data to table
      autoColumns: true, //create columns from data field names
      layout: "fitColumns",
    });
  })
  .catch(function (error) {
    console.log(error);
  });

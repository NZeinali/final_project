// ################################################################################################ //
//                                     PROPERTY BEDROOM / LAND SIZE ANALYSIS
// ################################################################################################ //

// // *************************************
// // GRANIM.JS
// // *************************************
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

d3.json("/maindata")
  .then((houseData) => {
    // ****************************************************************************** //
    // Popular land size plotted by plotly
    var popular_land_size = houseData.map((data) => data.Land_Area);

    var trace = {
      x: popular_land_size,
      type: "histogram",
      xbins: {
        size: 50,
      },
    };

    var data = [trace];

    var layout = {
      title: `Popular House Size in Perth Metro (2005-2020)`,
      xaxis: {
        title: "Land Size (m2)",
        dtick: 100,
        range: [100, 1500],
      },
      yaxis: {
        title: "Count",
      },
      margin: {
        l: 100,
        r: 100,
        b: 100,
        t: 100,
      },
    };

    Plotly.newPlot("hist_landsize", data, layout);
    // ****************************************************************************** //
    // ################################################################################################ //
    //                                       PROPERTY AGE ANALYSIS
    // ################################################################################################ //

    d3.json("/maindata")
      .then((houseData) => {
        var price_below_1990 = [];
        var price_1990_1995 = [];
        var price_1995_2000 = [];
        var price_2000_2005 = [];
        var price_2005_2010 = [];
        var price_2010_2015 = [];
        var price_above_2015 = [];

        houseData.forEach((data) => {
          if (data.Build_Year <= 1990) {
            price_below_1990.push(Math.round(data.Price / data.Land_Area));
          } else if (data.Build_Year <= 1995) {
            price_1990_1995.push(Math.round(data.Price / data.Land_Area));
          } else if (data.Build_Year <= 2000) {
            price_1995_2000.push(Math.round(data.Price / data.Land_Area));
          } else if (data.Build_Year <= 2005) {
            price_2000_2005.push(Math.round(data.Price / data.Land_Area));
          } else if (data.Build_Year <= 2010) {
            price_2005_2010.push(Math.round(data.Price / data.Land_Area));
          } else if (data.Build_Year <= 2015) {
            price_2010_2015.push(Math.round(data.Price / data.Land_Area));
          } else {
            price_above_2015.push(Math.round(data.Price / data.Land_Area));
          }
        });

        // Calculate average sales price per sqm of land for each "Build_Year" period
        var sum = 0;
        price_below_1990.forEach((price) => {
          sum += price;
        });
        var avg_price_below_1990 = Math.round(sum / price_below_1990.length);
        // **********
        var sum = 0;
        price_1990_1995.forEach((price) => {
          sum += price;
        });
        var avg_price_1990_1995 = Math.round(sum / price_1990_1995.length);
        // **********
        var sum = 0;
        price_1995_2000.forEach((price) => {
          sum += price;
        });
        var avg_price_1995_2000 = Math.round(sum / price_1995_2000.length);
        // **********
        var sum = 0;
        price_2000_2005.forEach((price) => {
          sum += price;
        });
        var avg_price_2000_2005 = Math.round(sum / price_2000_2005.length);
        // **********
        var sum = 0;
        price_2005_2010.forEach((price) => {
          sum += price;
        });
        var avg_price_2005_2010 = Math.round(sum / price_2005_2010.length);
        // **********
        var sum = 0;
        price_2010_2015.forEach((price) => {
          sum += price;
        });
        var avg_price_2010_2015 = Math.round(sum / price_2010_2015.length);
        // **********
        var sum = 0;
        price_above_2015.forEach((price) => {
          sum += price;
        });
        var avg_price_above_2015 = Math.round(sum / price_above_2015.length);

        // Defining arrays for the plot
        var xValue = [
          "Before 1990",
          "1990-2000",
          "2000-2005",
          "2005-2010",
          "2010-2015",
          "After 2015",
        ];
        var yValue = [
          avg_price_below_1990,
          avg_price_1990_1995,
          avg_price_1995_2000,
          avg_price_2000_2005,
          avg_price_2005_2010,
          avg_price_2010_2015,
          avg_price_above_2015,
        ];

        // Plot by PLOTLY
        var trace = {
          x: xValue,
          y: yValue,
          type: "bar",

          marker: {
            color: "rgb(158,202,225)",
            opacity: 0.6,
            line: {
              color: "rgb(8,48,107)",
              width: 1.5,
            },
          },
        };

        var data = [trace];

        var layout = {
          title: "Age of Property Analysis",
          xaxis: {
            title: "Year Built",
          },
          yaxis: {
            title: "Average Price per Land Size ($/m2)",
          },
        };

        Plotly.newPlot("age_plotly", data, layout);
      })
      .catch(function (error) {
        console.log(error);
      });

    // ################################################################################################ //
    //                                       PROPERTY SUBURB ANALYSIS
    // ################################################################################################ //

    d3.json("/maindata")
      .then((houseData) => {
        // Get the array of SUBURBS and PRICES of each property
        var suburb_arr = houseData.map((house) => house.Suburb);
        var price_arr = houseData.map((house) => house.Price);
        var land_arr = houseData.map((house) => house.Land_Area);

        // Get all the unique values of SUBURB array by creating a function
        function onlyUnique(value, index, self) {
          return self.indexOf(value) === index;
        }

        var unique_suburbs = suburb_arr.filter(onlyUnique);

        var sum_price_unique_suburbs = [];

        unique_suburbs.forEach((suburb) => {
          var sum = 0;
          var sum_per_land = 0;
          var count = 0;

          for (var i = 0; i < suburb_arr.length; i++) {
            if (suburb_arr[i] == suburb) {
              sum += price_arr[i];
              sum_per_land += price_arr[i] / land_arr[i];
              count += 1;
            }
          }
          sum_price_unique_suburbs.push({
            Suburb: suburb,
            Avg_Price_per_Land: Math.round(sum_per_land / count),
            Avg_Price: Math.round(sum / count),
          });
        });

        // Sort array by object key value
        sum_price_unique_suburbs.sort(function (a, b) {
          return b.Avg_Price_per_Land - a.Avg_Price_per_Land;
        });

        // Plot horizontal bar chart using PLOTLY

        var sliced_suburb = [];
        var sliced_price = [];
        var sliced_price_per_land = [];

        // Pick top 10 suburbs
        for (var i = 0; i < 10; i++) {
          sliced_suburb.push(sum_price_unique_suburbs[i].Suburb);
          sliced_price.push(sum_price_unique_suburbs[i].Avg_Price);
          sliced_price_per_land.push(
            sum_price_unique_suburbs[i].Avg_Price_per_Land
          );
        }

        var xSuburbPrice = sliced_price;
        var xSuburbPricePerLand = sliced_price_per_land;
        var ySuburb = sliced_suburb;

        // Plotly
        var trace1 = {
          x: xSuburbPricePerLand,
          y: ySuburb,
          xaxis: "x1",
          yaxis: "y1",
          type: "bar",
          marker: {
            color: "rgba(50,171,96,0.6)",
            line: {
              color: "rgba(50,171,96,1.0)",
              width: 1,
            },
          },
          name: "Top 10 expensive suburbs",
          orientation: "h",
          transforms: [
            {
              type: "sort",
              target: "x",
              order: "ascending",
            },
          ],
        };

        var trace2 = {
          x: xSuburbPrice,
          y: ySuburb,
          xaxis: "x2",
          yaxis: "y1",
          type: "bar",
          marker: {
            color: "#FF5733",
            line: {
              color: "#FF5733",
              width: 1,
            },
          },
          orientation: "h",

          name: "Average total sales price for the top 10 expensive suburbs",
        };

        var data = [trace1, trace2];

        var layout = {
          title: "Suburb Analysis",
          xaxis1: {
            range: [0, 4000],
            domain: [0, 0.45],
            title: "Price per Land Size ($/m2)",
            zeroline: false,
            showline: false,
            showticklabels: true,
            showgrid: true,
          },
          xaxis2: {
            range: [700000, 1800000],
            domain: [0.55, 1],
            title: "Total Sales Price ($)",
            zeroline: false,
            showline: false,
            showticklabels: true,
            showgrid: true,
            side: "top",
            dtick: 100000,
          },
          legend: {
            x: 0,
            y: 1.3,
            font: {
              size: 14,
            },
          },
          margin: {
            l: 150,
            r: 70,
            t: 150,
            b: 70,
          },

          annotations: [],
        };

        for (var i = 0; i < 10; i++) {
          var result = {
            xref: "x1",
            yref: "y1",
            x: xSuburbPricePerLand[i] + 190, // position of labels
            y: ySuburb[i], // position of labels
            text: xSuburbPricePerLand[i] + " $/m2",
            font: {
              family: "Arial",
              size: 14,
              color: "green",
            },
            showarrow: false,
          };
          var result2 = {
            xref: "x2",
            yref: "y1",
            x: xSuburbPrice[i] + 50000, // position of labels
            y: ySuburb[i], // position of labels
            text: xSuburbPrice[i] + " $",
            font: {
              family: "Arial",
              size: 14,
              color: "black",
            },
            showarrow: false,
          };

          layout.annotations.push(result, result2);
        }

        Plotly.newPlot("suburb_plotly", data, layout);
      })
      .catch(function (error) {
        console.log(error);
      });

    // ################################################### //
    // Distance to School Analysis
    // ################################################### //

    // Create an array of top 10 Perth's schools
    var top_perth_schools = [
      "PERTH MODERN SCHOOL",
      "PRESBYTERIAN LADIES COLLEGE",
      "PENRHOS COLLEGE",
      "CHRIST CHURCH GRAMMAR SCHOOL",
      "SANTA MARIA COLLEGE",
      "ST HILDA'S ANGLICAN SCHOOL FOR GIRLS",
      "PERTH COLLEGE",
      "ST MARY'S ANGLICAN GIRLS' SCHOOL",
      "HALE SCHOOL",
      "SHENTON COLLEGE",
    ];

    // Initializes the page with a default plot
    function init() {
      var dropdownMenu = d3.selectAll("#selSchool");

      // Populate dropdown Menu with the test subject IDs
      top_perth_schools.forEach((school) => {
        var dataset = dropdownMenu.append("option");
        dataset.property("value", school);
        dataset.text(school);
      });

      scatterChart("PERTH MODERN SCHOOL");
    }

    function scatterChart(school) {
      // Filter data based on the selected school name
      var selecteddata = houseData.filter(
        (data) => data.Nearest_SCH === school
      );

      // Data gathering for scatter chart
      // x is the distance to the school (km)
      // y is the price per land area ($/m2)
      var x = selecteddata.map((data) => data.Nearest_SCH_Dist);
      var y = selecteddata.map((data) =>
        Math.round(data.Price / data.Land_Area)
      );
      // Plotly
      var trace = {
        x: x,
        y: y,
        mode: "markers",
        type: "scatter",

        marker: { size: 12 },
      };

      var data = [trace];

      var layout = {
        xaxis: {
          title: "Distance (km)",
          dtick: 0.2,
        },
        yaxis: {
          title: "Price per Land Size ($/m2)",
        },
        title: "Impact of Distance to School on Housing Price",
      };

      Plotly.newPlot("scatter_school", data, layout);
    }
    // On change to the DOM, call optionChanged()
    d3.selectAll("#selSchool").on("change", optionChanged);

    // Function called by DOM changes

    function optionChanged() {
      var dropdownMenu = d3.selectAll("#selSchool");
      var selectedSchool = dropdownMenu.property("value");
      scatterChart(selectedSchool);
    }

    init();
  })
  .catch(function (error) {
    console.log(error);
  });

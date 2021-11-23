d3.json("/avgprice")
  .then((houseData) => {
    // Convert string to number

    // console.log(houseData);
    var houseSuburb = houseData.map((data) => data.Suburb.toUpperCase());
    var housePrice = houseData.map((data) => data.Price_Land);
    // console.log(houseSuburb);

    // Creating map object
    var myMap = L.map("map", {
      center: [-31.9523, 115.8613],
      zoom: 13,
    });

    // Adding tile layer
    L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      {
        attribution:
          "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken:
          "pk.eyJ1IjoibnplaW5hbGkiLCJhIjoiY2t1NnQ2b2Z6MGFqOTJwbW9sNDFudnY4bCJ9.qAgJrcxtzGCEe7neWMo48Q",
      }
    ).addTo(myMap);

    // Function that will determine the color of a country based on the country it belongs to
    // function chooseColor(country) {
    //   switch (country) {
    //     case "ATWELL":
    //       return "red";
    //     case "COCKBURN":
    //       return "purple";
    //     case "Italy":
    //       return "orange";
    //     case "Canada":
    //       return "green";
    //     case "India":
    //       return "purple";
    //     default:
    //       return "black";
    //   }
    // }

    // Use this link to get the geojson data.
    var geodata = "/geojson";
    var geojson;

    // Grabbing our GeoJSON data..
    d3.json(geodata).then(function (data) {
      
      // Editing geojson by adding price item
      for (var i = 0; i < data.features.length; i++) {
        for (var j = 0; j < housePrice.length; j++) {
          if (data.features[i].properties.wa_local_2 === houseSuburb[j]) {
            data.features[i].properties.wa_local_6 = housePrice[j];
          }
        }
      }



      // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      geojson = L.choropleth(data, {
        // Define what  property in the features to use
        valueProperty: "wa_local_6",

        // Set color scale
        scale: ["#ffffb2", "#b10026"],

        // Number of breaks in step range
        steps: 10,

        // q for quartile, e for equidistant, k for k-means
        mode: "q",
        style: {
          // Border color
          color: "#fff",
          weight: 1,
          fillOpacity: 0.8,
        },

        // Binding a pop-up to each layer
        onEachFeature: function (feature, layer) {
          layer.bindPopup(
            "Suburb: " +
              feature.properties.wa_local_2 +
              "<br>Avg Price per Land ($/m2): " +
              Math.round(feature.properties.wa_local_6)
          );
        },
      }).addTo(myMap);

      // Set up the legend
      var legend = L.control({ position: "bottomright" });
      legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var limits = geojson.options.limits;
        var colors = geojson.options.colors;
        var labels = [];

        // Add min & max
        var legendInfo =
          "<h1>Average Price per Land ($/m2)</h1>" +
          '<div class="labels">' +
          '<div class="min">' +
          Math.round(limits[0]) +
          "</div>" +
          '<div class="max">' +
          Math.round(limits[limits.length - 1]) +
          "</div>" +
          "</div>";

        div.innerHTML = legendInfo;

        limits.forEach(function (limit, index) {
          labels.push(
            '<li style="background-color: ' + colors[index] + '"></li>'
          );
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
      };

      // Adding legend to the map
      legend.addTo(myMap);

      // *******************************************
    });
  })
  .catch(function (error) {
    console.log(error);
  });

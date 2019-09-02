/* =====================
Leaflet Configuration
===================== */

//Creating the map
var map = L.map('map', {
  center: [40.895022, -77.722284],
  zoom: 8
});

var OpenStreetMap_HOT = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
}).addTo(map);

var Esri_WorldTopoMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
});

var extra_text = "";

var instructions = "<h3>" + "Click on a State Park or a Trail to see information and a link to the official website" + "</h3>";

$('#text').append(instructions);
$('#trail').append(extra_text);

L.easyButton('<img src="css/zoom_2.png">', function(btn, map) {
  var pennsylvania = [40.895022, -77.722284];
  map.setView(pennsylvania, 8);
}).addTo(map);


//Style function to change style based on quantile breaks
var parkStyle = function(feature) {
  if (feature.properties.CAMPING == "Yes") {
    return {
      fillColor: "#256F5B",
      fillOpacity: 0.8,
      color: "#003829",
      weight: 2,
      radius: 6
    };
  }
  if (feature.properties.CAMPING == "No") {
    return {
      fillColor: "#DC7C4E",
      fillOpacity: 0.8,
      color: "#9A3E12",
      weight: 2,
      radius: 6
    };
  }
};


var trailStyle = function(feature) {
  if (feature.properties.DIFFICULTY == "Easiest") {
    return {
      color: "#256F5B",
      opacity: 0.8,
      weight: 3
    };
  }
  if (feature.properties.DIFFICULTY == "More Difficult") {
    return {
      color: "#D3562B",
      opacity: 0.8,
      weight: 3
    };
  }
  if (feature.properties.DIFFICULTY == "Most Difficult") {
    return {
      color: "#870003",
      opacity: 0.8,
      weight: 3
    };
  } else {
    return {
      color: "#743A13",
      opacity: 0.8,
      weight: 3
    };
  }

};

var waterParkStyle = function(feature) {
  return {
    fillColor: "#487E95",
    fillOpacity: 0.8,
    weight: 0,
    opacity: 1
  };
};

var parkShapeStyle = function(feature) {
  return {
    fillOpacity: 0.1,
    color: "#323814",
    opacity: 0.5,
    weight: 2,
    dashArray: "6 4"
  };
};

var all_trailStyle = function(feature) {
  return {
    color: "#743A13",
    opacity: 0.8,
    weight: 2,
    dashArray: "2 4"
  };
};

// var trailZoomOut = {
//   weight: 2
// };

var trailOver = {
  weight: 5
};

var trailOut = {
  weight: 3
};

var all_trailOver = {
  weight: 3,
  opacity: 1
};

var all_trailOut = {
  weight: 2,
  opacity: 0.8

};



//Changing the opacity and line weight for when a feature is moused over
var overStyle = {
  fillOpacity: 1,
  weight: 4,
  radius: 8
};


//Changing the opacity and line weight back to original
var outStyle = {
  fillOpacity: 0.8,
  weight: 2,
  radius: 6
};

//Creating a global variable to store the coordinates of each feature when it gets clicked on
var view = [];

var eachTrail = function(feature, layer) {
  layer.bindLabel('<b>' + layer.feature.properties.NAME + '</b>' + '<br>' + 'Miles: ' + Math.round(layer.feature.properties.MILES * 100) / 100 +
    '<br>' + layer.feature.properties.SURFACE);

  layer.on('mouseover', function() {
    layer.setStyle(trailOver);
  });
  layer.on('mouseout', function() {
    layer.setStyle(trailOut);
  });

  layer.on('click', function(e) {
    /* =====================
    The following code will run every time a feature on the map is clicked.
    ===================== */
    view.push(e.latlng.lat, e.latlng.lng);

    //setting the map view to center on clicked feature, zooming in to 14.

    var bounds = this.getBounds();
    map.fitBounds(bounds);

    // map.setView(view, 14);

    //emptying the view variable so that it can be stored with new lat longs
    view = [];

    $('#trail').empty();
    $('#trail').append('<br>' + '<b>' + 'Trail - ' + layer.feature.properties.NAME + '</b>' + '<br>' + '<br>' + layer.feature.properties.DESCRIPTIO);

  });
};

var each_PA_Trail = function(feature, layer) {
  layer.bindLabel('<b>' + layer.feature.properties.NAME01 + '</b>' + '<br>' + 'Miles: ' + Math.round(layer.feature.properties.MILES * 100) / 100);

  layer.on('mouseover', function() {
    layer.setStyle(all_trailOver);
  });
  layer.on('mouseout', function() {
    layer.setStyle(all_trailOut);
  });

  layer.on('click', function(e) {
    /* =====================
    The following code will run every time a feature on the map is clicked.
    ===================== */
    view.push(e.latlng.lat, e.latlng.lng);

    //setting the map view to center on clicked feature, zooming in to 14.

    var bounds = this.getBounds();
    map.fitBounds(bounds);

    // map.setView(view, 14);

    //emptying the view variable so that it can be stored with new lat longs
    view = [];

    $('#trail').empty();
    $('#trail').append('<br>' + '<b>' + 'Trail - ' + layer.feature.properties.NAME01 + '</b>' + '<br>' + '<br>' + layer.feature.properties.DESCRIPTIO +
      '<br>' + '<br>' + "<a href=" + '"' + layer.feature.properties.MGMT_WEBSI + '"' + "target='_blank'>Trail Website</a>");

  });
};


var eachBoundary = function(feature, layer) {
  // layer.bindLabel('<b>' + layer.feature.properties.NAME + '</b>' +  '<br>' + 'Miles: ' + Math.round(layer.feature.properties.MILES * 100) / 100 +
  // '<br>' + layer.feature.properties.SURFACE);

  // layer.on('mouseover', function() { layer.setStyle(trailOver);});
  // layer.on('mouseout', function() { layer.setStyle(trailOut);});

  layer.on('click', function(e) {
    /* =====================
    The following code will run every time a feature on the map is clicked.
    ===================== */
    // view.push(e.latlng.lat, e.latlng.lng);

    //setting the map view to center on clicked feature, zooming in to 14.

    var bounds = this.getBounds();
    map.fitBounds(bounds);

    // map.setView(view, 14);

    //emptying the view variable so that it can be stored with new lat longs
    // view = [];

    // $('#text').empty();
    // $('#text').append('<b>' + 'Trail - ' + layer.feature.properties.NAME + '</b>' + '<br>' + '<br>' + layer.feature.properties.DESCRIPTION);

  });
};

var sqlQuery;

//Function that dictates what happens to each feature of the leaflet layer
var eachFeature = function(feature, layer) {
  layer.bindLabel('<h2>' + layer.feature.properties.PARK_NAME + '</h2>' + '<b>' + 'Disc Golf: ' + '</b>' + layer.feature.properties.DISC_GOLF + '<br>' + '<b>' +
    'Hiking: ' + '</b>' + layer.feature.properties.HIKING + '<br>' + '<b>' + 'Canoe/Kayaking: ' + '</b>' + layer.feature.properties.CANOE_KAYA + '<br>' +
    '<b>' + 'Swimming: ' + '</b>' + layer.feature.properties.SWIMMING + '<br>');

  /* =====================
  The following code will run every time a feature on the map is moused over.
  ===================== */

  //Setting the style to change when a feature is moused over, and setting it back to its original state
  layer.on('mouseover', function() {
    layer.setStyle(overStyle);
  });
  layer.on('mouseout', function() {
    layer.setStyle(outStyle);
  });

  layer.on('click', function(e) {
    /* =====================
    The following code will run every time a feature on the map is clicked.
    ===================== */

    //pushing the lat long of each clicked feature into the view variable
    view.push(e.latlng.lat, e.latlng.lng);
    console.log(view);

    //setting the map view to center on clicked feature, zooming in to 14.
    map.setView(view, 14);

    //emptying the view variable so that it can be stored with new lat longs
    view = [];

    $('#trail').empty();
    $('#text').empty();
    $('#text').append('<b>' + 'State Park - ' + layer.feature.properties.PARK_NAME + '</b>' + '<br>' + '<br>' + layer.feature.properties.WEB_DESCRI +
      '<br>' + '<br>' + "<a href=" + '"' + layer.feature.properties.PARK_WEB_L + '"' + "target='_blank'>Park Website</a>");

    //   sqlQuery = "SELECT * FROM Pennsylvania_State_Park_Amenities WHERE PARK_NAME='Marsh Creek'";
    //
    //   $.getJSON("http://www.gis.dcnr.state.pa.us/agsprod/rest/services/Parks/State_Parks/MapServer/3/query?outFields=*&where=1%3D1", function(data) {
    //     console.log(data);
    // });
  });
};

//Creating variable for the data
var parks_pa;
var trails_pa;
var water_park;
var park_shapes;
var state_park_trails;


//calling the data for state park ponds and lakes
water_park = new L.geoJson(pa_state_park_ponds_lakes, {
  // onEachFeature: eachTrail,
  style: waterParkStyle
});


//calling the data for trails for state parks
state_park_trails = new L.geoJson(pa_state_park_hiking_trails, {
  onEachFeature: eachTrail,
  style: trailStyle
});

trails_pa = new L.geoJson(pa_hiking_trails, {
  onEachFeature: each_PA_Trail,
  style: all_trailStyle
}).addTo(map);

//calling the data for state park boundaries
park_shapes = new L.geoJson(pa_state_park_boundaries, {
  onEachFeature: eachBoundary,
  style: parkShapeStyle
});


//calling the data for park points
parks_pa = new L.geoJson(pa_state_park_amenities, {
  pointToLayer: function(feature, coordinates) {
    return L.circleMarker(coordinates);
  },
  onEachFeature: eachFeature,
  style: parkStyle
}).addTo(map);



map.on('zoomend', function() {
  if (map.getZoom() > 10) {

    if (map.hasLayer(OpenStreetMap_HOT)) {
      map.removeLayer(OpenStreetMap_HOT);
      Esri_WorldTopoMap.addTo(map);
    }

    map.addLayer(park_shapes);
    map.addLayer(state_park_trails);
    map.addLayer(water_park);
    map.removeLayer(parks_pa);

    // state_park_trails.setStyle(trailZoomOut);


  }

  if (map.getZoom() < 10) {

    if (map.hasLayer(Esri_WorldTopoMap)) {
      map.removeLayer(Esri_WorldTopoMap);
      OpenStreetMap_HOT.addTo(map);
    }

    $('#text').empty();
    $('#trail').empty();
    $('#text').append(instructions);
    $('#trail').append(extra_text);
    map.removeLayer(park_shapes);
    map.removeLayer(state_park_trails);
    map.removeLayer(water_park);
    map.addLayer(parks_pa);
  }
});

//Function to assign the colors to the legend labels
function getColor(d) {
  return d == "Yes" ? '#003829' :
    d == "No" ? '#DC7C4E' :
    '#FFEDA0';
}

//I might use this later, if there are different colors for the borders, they will need to be added
//separately to the legend

// function getColor_border(d) {
//     return d == "-12 to -6"? '#C35B29' :
//            d == "-5 to -3" ? '#DC7C4E' :
//            d == "-2 to -1" ? '#FEA77D' :
//            d == "0"        ? '#DFF6F5' :
//            d == "1 to 5"   ? '#7BC0BD' :
//            d == "6 to 8"   ? '#4C9A97' :
//            d == "9 to 14"  ? '#1A716E' :
//                              '#FFEDA0';
// }


var legend = L.control({
  position: 'bottomleft'
});

legend.onAdd = function(map) {

  //Creating the div for the legend
  var div = L.DomUtil.create('div', 'info legend title'),
    grades = ["Yes", "No"];

  //Legend label
  div.innerHTML += '<b>Camping</b><br>'; // don't forget the break tag

  // loop through intervals and generate a label with a colored block for each interval
  //This is looking through the grades variable created above and pulling the corresponding color from the getColor function
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i class="circle" style="background:' + getColor(grades[i]) + '"></i>' +
      (grades[i] ? grades[i] + '<br>' : '+');
  }

  return div;
};

legend.addTo(map);

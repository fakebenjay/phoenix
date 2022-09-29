/* global mapboxgl */

mapboxgl.accessToken =
  "pk.eyJ1IjoiYmVuLWpheSIsImEiOiJjbDhuNTNzdWowNWx1M3VxdXk0anRvdTdiIn0.VVQCsIEEyLw-G7uxPcdW_Q";


var zoomScale = d3.scaleLinear()
  .domain([200, 375, 640])
  .range([8.6, 8.6, 8.6])
  .clamp(true)

var latScale = d3.scaleLinear()
  .domain([200, 375, 640])
  .range([-112.0740, -112.0740, -112.0740])
  .clamp(true)

const map = new mapboxgl.Map({
  container: "savannah-map",
  style: "mapbox://styles/mapbox/light-v10", // <- more at https://docs.mapbox.com/api/maps/styles/
  center: [latScale(window.innerWidth), 33.585], // <- [longitude, latitude]
  zoom: zoomScale(window.innerWidth),
  projection: 'mercator',
  maxBounds: [
    [-113, 33.25],
    [-111.5, 34]
  ]
});

// Navigation buttons //
const nav = new mapboxgl.NavigationControl({
  showCompass: false,
});
map.addControl(nav, "top-right");

map.on('load', () => {
  // map.setPaintProperty('place-labels', 'fill-color', '#faafee');
  // map.setPaintProperty('settlement-minor-layer', 'fill-color', '#faafee');



  map.addSource("zips", {
    type: "geojson",
    data: 'phoenix-data-filter.json',
  });

  map.addLayer({
    id: "zips",
    type: "fill",
    source: "zips",
    paint: {
      'fill-color': {
        property: 'top_corpo_rate',
        // type: 'categorical',
        stops: [
          // [-1, '#d3d3d3'],
          [0, '#fff'],
          [.5, '#f00']
        ]
      },
      'fill-opacity': .8
    },
  });

  map.addLayer({
    id: "zips-border",
    type: "line",
    source: "zips",
    paint: {
      'line-color': 'black',
      'line-width': .2
    },
  });
})




//
//   map.addSource('roads', {
//     'type': 'geojson',
//     'data': 'https://assets.law360news.com/1515000/1515386/roads.json'
//   });
//
//   map.addLayer({
//     'id': 'roads',
//     'type': 'line',
//     'source': 'roads',
//     'layout': {
//       'line-join': 'round',
//       'line-cap': 'round'
//     },
//     'paint': {
//       'line-color': {
//         property: 'FULLNAME',
//         type: 'categorical',
//         stops: [
//           ['I-95', '#475DCD'],
//           ['I-16', '#475DCD'],
//           ['I-516', '#475DCD'],
//           ['Jimmy DeLoach Pkwy/GA-17', 'black'],
//           ['Jimmy DeLoach Pkwy/GA-17 Extension', 'black']
//         ]
//       },
//       'line-width': 8,
//       // 'line-dasharray': {
//       //   property: 'FULLNAME',
//       //   type: 'categorical',
//       //   stops: [
//       //     ['I-95', [1, 0]],
//       //     ['I-16', [1, 0]],
//       //     ['I-516', [1, 0]],
//       //     ['Jimmy DeLoach Pkwy/GA-17', [1, 0]],
//       //     ['Jimmy DeLoach Pkwy/GA-17 Extension', [1, 1]]
//       //   ]
//       // }
//     }
//   }, 'road-label');
//
//   map.addLayer({
//     'id': 'roads-inner',
//     'type': 'line',
//     'source': 'roads',
//     'layout': {
//       'line-join': 'round',
//       'line-cap': 'round'
//     },
//     'paint': {
//       'line-color': {
//         property: 'FULLNAME',
//         type: 'categorical',
//         stops: [
//           ['I-95', '#F13B3B'],
//           ['I-16', '#F13B3B'],
//           ['I-516', '#F13B3B'],
//           ['Jimmy DeLoach Pkwy/GA-17', 'white'],
//           ['Jimmy DeLoach Pkwy/GA-17 Extension', 'white']
//         ]
//       },
//       'line-width': 1.5,
//       'line-opacity': 1,
//       'line-dasharray': {
//         property: 'FULLNAME',
//         type: 'categorical',
//         stops: [
//           ['I-95', [1, 0]],
//           ['I-16', [1, 0]],
//           ['I-516', [1, 0]],
//           ['Jimmy DeLoach Pkwy/GA-17', [1, 0]],
//           ['Jimmy DeLoach Pkwy/GA-17 Extension', [6, 6]]
//         ]
//       }
//     }
//   }, 'road-label');
//
//   map.addSource("ports", {
//     type: "geojson",
//     data: 'https://assets.law360news.com/1515000/1515386/ports.json',
//   });
//
//   map.addLayer({
//     'id': 'ports-text',
//     'type': 'symbol',
//     'source': 'ports',
//     'minzoom': 8.4,
//     'layout': {
//       'text-field': [
//         'format',
//         ['upcase', ['get', 'name']],
//         {
//           'font-scale': 0.7
//         },
//         '\n',
//         {},
//         ['get', 'subtitle'],
//         {
//           'font-scale': 0.7
//         }
//       ],
//       // "text-offset": ['get', 'offset'],
//       'text-anchor': 'bottom-left',
//       'text-justify': 'right',
//       'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
//       // 'text-letter-spacing': .05
//     },
//     'paint': {
//       'text-color': {
//         property: 'name',
//         type: 'categorical',
//         stops: [
//           ['Garden City Terminal', '#004a8f'],
//           ['Ocean Terminal', '#004a8f'],
//           ['Bryan County Megasite', '#e8171f']
//         ]
//       },
//       // 'text-color': 'black',
//       'text-halo-color': '#f1f1f1',
//       "text-halo-width": 1.5
//     }
//   });
//
//   map.addLayer({
//     id: "ports-fill",
//     type: "fill",
//     source: "ports",
//     paint: {
//       'fill-color': {
//         property: 'name',
//         type: 'categorical',
//         stops: [
//           ['Garden City Terminal', '#004a8f'],
//           ['Ocean Terminal', '#004a8f'],
//           ['Bryan County Megasite', '#e8171f']
//         ]
//       },
//       'fill-opacity': .8
//     },
//   }, 'road-label');
//
//   map.addLayer({
//     id: "ports-line",
//     type: "line",
//     source: "ports",
//     paint: {
//       'line-color': {
//         property: 'name',
//         type: 'categorical',
//         stops: [
//           ['Garden City Terminal', '#004a8f'],
//           ['Ocean Terminal', '#004a8f'],
//           ['Bryan County Megasite', '#e8171f']
//         ]
//       },
//       'line-width': 2
//     },
//   }, 'road-label');
//
//   map.addSource('counties', {
//     'type': 'geojson',
//     'data': 'https://assets.law360news.com/1515000/1515386/counties.json'
//   });
//
//   map.addLayer({
//     'id': 'counties-line',
//     'type': 'line',
//     'source': 'counties',
//     'layout': {
//       'line-join': 'round',
//       'line-cap': 'round'
//     },
//     'paint': {
//       'line-color': '#36454F',
//       'line-width': 1
//     }
//   }, 'road-label');
//
//   map.addLayer({
//     id: "counties-fill",
//     type: "fill",
//     source: "counties",
//     paint: {
//       'fill-color': 'white',
//       'fill-opacity': 0
//     },
//   }, 'road-label');
// });
//
// // Points Example: Recent Earthquakes //
// // map.on("load", () => {
// //   map.addSource("earthquakes", {
// //     type: "geojson",
// //     // Use a URL for the value for the `data` property.
// //     data: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson",
// //   });
// //
// //   map.addLayer({
// //     id: "earthquakes-layer",
// //     type: "circle",
// //     source: "earthquakes",
// //     paint: {
// //       "circle-radius": 5,
// //       "circle-color": {
// //         "property": "mag",
// //         "stops": [
// //           [0, 'yellow'],
// //           [3, 'orange'],
// //           [5, 'red'],
// //           [7, 'darkred']
// //         ]
// //       },
// //       "circle-opacity": 0.7,
// //       "circle-stroke-color": "white",
// //       "circle-stroke-width": 1
// //     },
// //   });
// // });
//
//
// // Popups for Hurricane Zones //
// // Create a popup, but don't add it to the map yet.
// const popup = new mapboxgl.Popup({
//   closeButton: false,
//   closeOnClick: false
// });
//
// map.on("mousemove", "counties-fill", (e) => {
//   // Change the cursor style
//   // debugger
//   map.getCanvas().style.cursor = "pointer";
//
//   // Get mouse coordinates
//   const coordinates = e.lngLat;
//
//   // get the information from the zone we're over
//   const county = e.features[0].properties.NAME;
//
//   // Make the popup text
//   const description = `<strong style="text-align:center;display:inline-block;">${county} County</strong>`
//
//   // Populate the popup and set its coordinates
//   // based on the feature found.
//   popup.setLngLat(coordinates).setHTML(description).addTo(map);
// });
//
// // remove the popup when we leave all zones
// map.on("mouseleave", "counties-fill", () => {
//   map.getCanvas().style.cursor = "";
//   popup.remove();
// });
//
// map.on("mousemove", "cities", (e) => {
//   // Change the cursor style
//   map.getCanvas().style.cursor = "pointer";
//
//   // Get mouse coordinates
//   const coordinates = e.lngLat;
//
//   // get the information from the zone we're over
//   const city = e.features[0].properties.NAME;
//
//   // Make the popup text
//   const description = `<strong style="text-align:center;display:inline-block;">${city}, Ga.</strong>`
//
//   // Populate the popup and set its coordinates
//   // based on the feature found.
//   popup.setLngLat(coordinates).setHTML(description).addTo(map);
// });
//
// // remove the popup when we leave all zones
// map.on("mouseleave", "cities", () => {
//   map.getCanvas().style.cursor = "";
//   popup.remove();
// });
//
// map.on("mousemove", "roads", (e) => {
//   // Change the cursor style
//   map.getCanvas().style.cursor = "pointer";
//
//   // Get mouse coordinates
//   const coordinates = e.lngLat;
//
//   // get the information from the zone we're over
//   const road = e.features[0].properties.FULLNAME;
//
//   // Make the popup text
//   const description = `<strong style="text-align:center;display:inline-block;">${road}</strong>`
//
//   // Populate the popup and set its coordinates
//   // based on the feature found.
//   popup.setLngLat(coordinates).setHTML(description).addTo(map);
// });
//
// // remove the popup when we leave all zones
// map.on("mouseleave", "roads", () => {
//   map.getCanvas().style.cursor = "";
//   popup.remove();
// });
//
// map.on("mousemove", "roads-inner", (e) => {
//   // Change the cursor style
//   map.getCanvas().style.cursor = "pointer";
//
//   // Get mouse coordinates
//   const coordinates = e.lngLat;
//
//   // get the information from the zone we're over
//   const road = e.features[0].properties.FULLNAME;
//
//   // Make the popup text
//   const description = `<strong style="text-align:center;display:inline-block;">${road}</strong>`
//
//   // Populate the popup and set its coordinates
//   // based on the feature found.
//   popup.setLngLat(coordinates).setHTML(description).addTo(map);
// });
//
// // remove the popup when we leave all zones
// map.on("mouseleave", "roads-inner", () => {
//   map.getCanvas().style.cursor = "";
//   popup.remove();
// });
//
// map.on("mousemove", "ports-fill", (e) => {
//   // Change the cursor style
//   map.getCanvas().style.cursor = "pointer";
//
//   // Get mouse coordinates
//   const coordinates = e.lngLat;
//
//   // get the information from the zone we're over
//   const port = e.features[0].properties.name;
//   const subtitle = e.features[0].properties.subtitle;
//
//   // Make the popup text
//   const description = `<strong style="text-align:center;display:inline-block;">${port}<br/>${subtitle}</strong>`
//
//   // Populate the popup and set its coordinates
//   // based on the feature found.
//
//   popup.setLngLat(coordinates).setHTML(description).addTo(map)
// });
//
// // remove the popup when we leave all zones
// map.on("mouseleave", "ports-fill", () => {
//   map.getCanvas().style.cursor = "";
//   popup.remove();
// });
//
// map.moveLayer('counties-fill', 'counties-line')
// map.moveLayer('roads', 'roads-inner')
// map.moveLayer('roads', 'roads')
// map.moveLayer('ports-fill')
// map.moveLayer('zips-border', 'zips')

$(document).ready(function() {
  $.ajax({
    type: "GET",
    url: 'geocoded.csv',
    dataType: "text",
    success: function(csvData) {
      makeGeoJSON(csvData);
    }
  });
});

function makeGeoJSON(csvData) {
  csv2geojson.csv2geojson(csvData, {
    latfield: 'lat',
    lonfield: 'lng',
    delimiter: ','
  }, function(err, data) {

    map.on('load', function() {

      map.addLayer({
        'id': 'airports',
        'type': 'symbol',
        'source': {
          'type': 'geojson',
          'data': data
        },
        'layout': {
          "icon-image": "marker-15"
        },
        'paint': {}
      });
    });
  });
}
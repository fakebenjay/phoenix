/* global mapboxgl */

mapboxgl.accessToken =
  "pk.eyJ1IjoiYmVuLWpheSIsImEiOiJjbDhuNTNzdWowNWx1M3VxdXk0anRvdTdiIn0.VVQCsIEEyLw-G7uxPcdW_Q";


var zoomScale = d3.scaleLinear()
  .domain([639, 640])
  .range([8.7, 8.9])
  .clamp(true)

var latScale = d3.scaleLinear()
  .domain([200, 375, 640])
  .range([-112.0740, -112.0740, -112.0740])
  .clamp(true)

var lngScale = d3.scaleLinear()
  .domain([639, 640])
  .range([33.635, 33.585])
  .clamp(true)

var colorScale = d3.scaleLinear()
  .domain([2.174, 1.087, 1, 0.5, 0])
  .range(['#db4325', '#eda247', '#e6e1bc', '#57C4AD', '#006164'])
  .clamp(true)
//#e6e1bc

const map = new mapboxgl.Map({
  container: "phoenix-map",
  style: "mapbox://styles/mapbox/light-v10", // <- more at https://docs.mapbox.com/api/maps/styles/
  center: [latScale(window.innerWidth), lngScale(window.innerWidth)], // <- [longitude, latitude]
  zoom: zoomScale(window.innerWidth),
  projection: 'mercator',
  maxBounds: [
    [-112.85, 33.0],
    [-111.5, 34.1]
  ]
});

// disable map rotation using right click + drag
map.dragRotate.disable();

// disable map rotation using touch rotation gesture
map.touchZoomRotate.disableRotation();

// Navigation buttons //


const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  bbox: [-112.85, 33.0, -111.5, 34.1],
  autocomplete: false,
  zoom: 15
})

map.addControl(geocoder, "top-right")
// .setBbox([-111.5, 33.0, -112.85, 33.9])

const nav = new mapboxgl.NavigationControl({
  showCompass: false,
});
map.addControl(nav, "top-right");

map.on('load', () => {
  map.addSource("zips", {
    type: "geojson",
    data: 'https://assets.law360news.com/1531000/1531385/phoenix-data-rankedv3.json',
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


$(document).ready(function() {
  $.ajax({
    type: "GET",
    url: 'https://assets.law360news.com/1531000/1531385/geocodedv3.csv',
    dataType: "text",
    success: makeGeoJSON
  })
})

function makeGeoJSON(csvData) {
  function doTheThing(err, data) {
    function plotTheMap(resolve, reject) {
      map.on('load', function() {
        map.addSource('houses', {
          type: 'geojson',
          // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
          // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
          data: data,
          cluster: true,
          clusterMaxZoom: 14, // Max zoom to cluster points on
          clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
        });

        map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'houses',
          filter: ['has', 'point_count'],
          paint: {
            // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 100
            //   * Yellow, 30px circles when point count is between 100 and 750
            //   * Pink, 40px circles when point count is greater than or equal to 750
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#56a9de',
              100,
              '#654f6f',
              750,
              '#6ba292'
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              10,
              50,
              15,
              375,
              20
            ]
          }
        });

        map.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'houses',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
          },
          paint: {
            'text-color': 'white'
          }
        });

        map.addLayer({
          'id': 'unclustered-point',
          'type': 'circle',
          'source': 'houses',
          // 'layout': {
          //   "icon-image": "marker-15"
          // },
          // 'paint': {}
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#132a43',
            'circle-radius': 5,
            'circle-stroke-width': 1,
            'circle-stroke-color': 'white'
          }
        });

        var popup = new mapboxgl.Popup()

        // When a click event occurs on a feature in
        // the unclustered-point layer, open a popup at
        // the location of the feature, with
        // description HTML from its properties.
        map.on('click', 'zips', (e) => {
          const coordinates = e.lngLat
          const zip = e.features[0].properties['GEOID20'];

          const top_corpo = e.features[0].properties['top_corpo'];
          const total = e.features[0].properties['total'];
          const top_corpo_rate = e.features[0].properties['top_corpo_rate'];
          const rank = e.features[0].properties['top_corpo_rank'];
          const pct_of_citywide = e.features[0].properties['top_corpo_pct_of_citywide'];

          // Ensure that if the map is zoomed out such that
          // multiple copies of the feature are visible, the
          // popup appears over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          popup
            .setLngLat(coordinates)
            .setHTML(
              `<strong style="font-size:16pt;width:100%;text-align:center;">${zip}</strong>
                <br/><br/>
                <span style='font-size:10pt;'><strong style='font-size:12pt;'>${numeral(top_corpo).format('0,0')}</strong> of <strong style='font-size:12pt;'>${numeral(total).format('0,0')}</strong> total single family detached rental properties are owned by Phoenix's top 25 corporate detached SFR holders.</span><br/><br/>
                <span style='font-size:10pt;'>Top corporate ownership rate of <strong style='font-size:12pt;'>${numeral(top_corpo_rate).format('0[.]0%')}</strong></span>
                <br/><br/>

                <span style='font-size:10pt;'>That's <strong style='font-size:12pt;padding:0 3px;border-radius:5px;background-color:${colorScale(pct_of_citywide)};color:${pct_of_citywide > 1.5 || pct_of_citywide < .45 ? 'white':'black'}'>${pct_of_citywide < 1.08 ? numeral(pct_of_citywide).format('0[.]0%') + '</strong> of' : numeral(pct_of_citywide).format('0,0[.]0') + ' times</strong>'} the citywide rate of <strong style='font-size:12pt;'>18.3%</strong></span>
                <br/><br/>
                <span style='font-size:10pt;'>Ranked <strong style='font-size:12pt;'>#${numeral(rank).format('0,0')}</strong> of <strong style='font-size:12pt;'>42</strong>${rank == 41 ? ' <strong>(2-way tie)</strong>':''}</span>
                `
            )
            .addTo(map);

        });

        map.on('click', 'clusters', (e) => {
          const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
          });
          const clusterId = features[0].properties.cluster_id;
          map.getSource('houses').getClusterExpansionZoom(
            clusterId,
            (err, zoom) => {
              if (err) return;

              map.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom + 1
              });
            }
          );
          popup.remove();
        });

        map.on('click', 'unclustered-point', (e) => {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const addr = e.features[0].properties['SITE_ADDR'];
          const city = e.features[0].properties['S_CITY'];
          const zip = e.features[0].properties['S_ZIP'];
          const company = e.features[0].properties['P_NAME'];
          const owner = e.features[0].properties['O_NAME'];
          const owner1 = e.features[0].properties['O_NAME_ONE'];
          const owner2 = e.features[0].properties['O_NAME_TWO'];
          const o_addr = e.features[0].properties['O_ADDR1'];
          const o_city = e.features[0].properties['O_CITY'];
          const o_state = e.features[0].properties['O_STATE'];
          const o_zip = e.features[0].properties['O_ZIP'];
          const o_zip_render = o_zip.length > 5 ? o_zip.slice(0, 5) + '-' + o_zip.slice(5, 9) : o_zip

          if (company.includes('Pathlight') && o_city === 'PLANO' && o_addr.includes('RIVERSIDE')) {
            var asterisk = "<br/><br/><em style='color:red;font-size:9pt;line-height:normal;'>*The address listed in public records doesn't exist, but Home Partners is based out of the above address, but in Chicago. Pathlight Property Management, which partners with Home Partners on a lease purchase program, is based out of Plano.</span>"
          } else if (company.includes('Morningside') && o_addr.includes('2307')) {
            var asterisk = "<br/><br/><em style='color:red;font-size:9pt;line-height:normal;'>*The address listed in public records is likely an error. Morningside Funding LLC is registered at 2370 Rice Boulevard, Suite 200 in Houston.</span>"
          } else {
            var asterisk = ""
          }

          // const asterisk = company === 'HOME PARTNERS' && o_city === 'PLANO' ? : ''
          // if (!!asterisk) {
          //   debugger
          // }
          // Ensure that if the map is zoomed out such that
          // multiple copies of the feature are visible, the
          // popup appears over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          popup
            .setLngLat(coordinates)
            .setHTML(
              `<strong style="font-size:12pt;">${addr}
                <br/>
                ${city} AZ, ${zip}</strong>
                <br/><br/>
                owned by:<br/>
                <strong style="font-size:12pt;">${company}</strong>
                <br/><br/>
                listed as:<br/>
                <strong>${owner}</strong><br/>
                <span style="color:${!!asterisk ? 'red':'black'}">${o_addr}<br/>
                ${o_city}, ${o_state} ${o_zip_render}</span>
                ${asterisk}
                `
              // ${!!owner1 && owner1 != owner ? `<br>` + owner1:''}
              // ${!!owner2 && owner2 != owner1 && owner2 != owner? `<br>` + owner2:''}`
            )
            .addTo(map);
        });


        map.on('mouseenter', 'clusters', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'clusters', () => {
          map.getCanvas().style.cursor = '';
        });

        map.on('mouseenter', 'unclustered-point', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'unclustered-point', () => {
          map.getCanvas().style.cursor = '';
        });

        map.on('zoom', () => {
          if (map.getZoom() > 10) {
            map.moveLayer('road-motorway-trunk')
            map.moveLayer('road-minor')
            map.moveLayer('road-primary')
            map.moveLayer('road-street')
            map.moveLayer('road-secondary-tertiary')
            map.moveLayer('road-path')
            map.moveLayer('road-rail')
            map.moveLayer('road-pedestrian')
            map.moveLayer('road-major-link')
            map.moveLayer('settlement-label')
            map.moveLayer('zips-border')
            map.moveLayer('road-label')
            map.moveLayer('clusters')
            map.moveLayer('cluster-count')
            map.moveLayer('unclustered-point')
          } else {
            map.moveLayer('zips')
            map.moveLayer('zips-border')
            map.moveLayer('clusters')
            map.moveLayer('cluster-count')
            map.moveLayer('unclustered-point')
          }
        });
      })
      return data
    }

    new Promise((resolve, reject) => {
        resolve(plotTheMap)
      })
      .then(() => {
        data.features.forEach((d) => {
          var select = document.querySelector('select.companies')
          var option = document.createElement("option");
          option.className = d.properties['P_NAME'].toLowerCase().replaceAll(' / ', '-').replaceAll(' ', '-').replaceAll('.', '')
          option.value = d.properties['P_NAME']
          option.text = d.properties['P_NAME']
          if (!Array.from(select.children).includes(document.querySelector(`option.${option.className}`))) {
            select.add(option);
          }
        })

        var $selectCompanies = $("select.companies").selectize({
          placeholder: 'Select a company...',
          allowEmptyOption: true,
          labelField: 'company',
          searchField: 'company',
          sortField: [{
            'field': 'company',
            'direction': 'asc'
          }],
          onChange: () => {
            map.getSource('houses').setData({
              type: "FeatureCollection",
              features: data.features.filter(function(d) {
                let val = $("select.companies").selectize()[0].selectize.getValue()
                if (!!val) {
                  return d.properties['P_NAME'] === val
                } else {
                  return true
                }
              })
            })
          }
        })
        $selectCompanies[0].selectize.clear();
      })
  }

  csv2geojson.csv2geojson(csvData, {
    latfield: 'lat',
    lonfield: 'lng',
    delimiter: ','
  }, doTheThing);
}
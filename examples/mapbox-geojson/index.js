/**
 * mapbox geojson/simplestyle example
 *
 */
'use strict';
var path = require('path');

var L = require('../../index.js');
var document = GLOBAL.document;

require('mapbox.js');

function mapboxGeojsonExample (filename, callback) {
    // create an element for the map.
    var element = document.createElement('div');
    element.id = 'map-leaflet-image';
    document.body.appendChild(element);

    var map = L.map(element.id).setView([37.8, -96], 4);
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    var canvas = L.canvas ? L.canvas() : undefined;

    var geojson = [{
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: [
                [-77.03238901390978, 38.913188059745586],
                [-122.414, 37.776]
            ]
        },
        properties: {
            stroke: '#fc4353',
            'stroke-width': 5
        }
    }];

    L.geoJson(geojson, {
        renderer: canvas,
        style: L.mapbox.simplestyle.style
    }).addTo(map);

    map.saveImage(filename, callback);
}

// run the example if it's ran directly
if (require.main === module) {
    console.log('Saving a mapbox styled image using leaflet-image...');
    console.time('leaflet-image');

    var filename = path.join(__dirname, 'test-mapbox-image.png');
    mapboxGeojsonExample(filename, function () {
        console.log('Saved file to ' + filename);
        console.timeEnd('leaflet-image');
    });
}

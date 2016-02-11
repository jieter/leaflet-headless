/**
 * leaflet-image example with choropleth.
 *
 * From leaflet tutorials: http://leafletjs.com/examples/choropleth.html
 */

var path = require('path');

var L = require('../../index.js');
var document = GLOBAL.document;

function choroplethExample (filename, callback) {

    // create an element for the map.
    var element = document.createElement('div');
    element.id = 'map-choropleth';
    document.body.appendChild(element);

    // the map.
    var map = L.map(element.id).setView([37.8, -96], 4);
    var canvas = L.canvas ? L.canvas() : undefined;

    L.tileLayer('http://{s}.tile.stamen.com/toner-background/{z}/{x}/{y}.png', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, ' +
        '<a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; ' +
        'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20
    }).addTo(map);

    // get color depending on population density value
    function getColor (d) {
        return d > 1000 ? '#800026' :
               d > 500  ? '#BD0026' :
               d > 200  ? '#E31A1C' :
               d > 100  ? '#FC4E2A' :
               d > 50   ? '#FD8D3C' :
               d > 20   ? '#FEB24C' :
               d > 10   ? '#FED976' :
                          '#FFEDA0';
    }

    function style (feature) {
        return {
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7,
            fillColor: getColor(feature.properties.density)
        };
    }

    L.geoJson(require('./us-states.js'), {
        renderer: canvas,
        style: style
    }).addTo(map);

    map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');

    map.saveImage(filename, callback);
}

// export if script is called as a module
if (typeof exports === 'object') {
    module.exports = choroplethExample;
}

// run the example if it's ran directly
if (require.main === module) {
    console.log('Save to image using leaflet-image...');
    console.time('choropleth');

    var filename = path.join(__dirname, 'test-choropleth.png');
    choroplethExample(filename, function (filename) {
        console.log('Saved file to ' + filename);
        console.timeEnd('choropleth');
    });
}

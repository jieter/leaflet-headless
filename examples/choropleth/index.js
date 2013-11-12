/**
 * leaflet-image example.
 *
 */

'use strict';
var fs = require('fs');
var L = require('../../index.js');
var leafletImage = require('leaflet-image');

// create an element for the map.
var element = document.createElement('div');
element.id = 'map';
document.body.appendChild(element);

// the map.
var map = L.map('map').setView([37.8, -96], 4);

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
function getColor(d) {
	return d > 1000 ? '#800026' :
	       d > 500  ? '#BD0026' :
	       d > 200  ? '#E31A1C' :
	       d > 100  ? '#FC4E2A' :
	       d > 50   ? '#FD8D3C' :
	       d > 20   ? '#FEB24C' :
	       d > 10   ? '#FED976' :
	                  '#FFEDA0';
}

function style(feature) {
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
	style: style
}).addTo(map);

map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


console.log('Save to image using leaflet-image...');
leafletImage(map, function (err, canvas) {
	var out = fs.createWriteStream(__dirname + '/test.png');
	var stream = canvas.pngStream();

	stream.on('data', function (chunk) {
		out.write(chunk);
	});

	stream.on('end', function () {
		console.log('Saved test.png');
	});

});

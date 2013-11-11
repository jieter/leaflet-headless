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
var map = L.map('map').setView([0, 0], 2);

// load some geojson
var gj = JSON.parse(fs.readFileSync(__dirname + '/countries.geojson'));

L.geoJson(gj).addTo(map);

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

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

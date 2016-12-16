'use strict';

var path = require('path');
var fs = require('fs');

var L = require('../index.js');

// canvas renderer for leaflet 1.0.0, do not use for leaflet 0.7.x
var canvas = L.canvas ? L.canvas() : undefined;

var chai = require('chai');
var diff = require('./image-diff.js');

require('chai-leaflet');
chai.should();

describe('Leaflet-headless', function () {
	var element, map;

	var lat = 52.4, lng = 4.5;
	var latlng = [lat, lng];

	beforeEach(function () {
		element = document.createElement('div');
		element.id = 'map';
		document.body.appendChild(element);

		map = L.map('map');
	});

	afterEach(function () {
		map.remove();
	});

	describe('Basic map functions', function () {
		it('has a default size of 1024x1024', function () {
			map.setView(latlng, 10);

			var size = map.getSize();
			size.x.should.equal(1024);
			size.y.should.equal(1024);
		});

		it('can change size', function () {
			map.setView(latlng, 10).setSize(800, 600);

			var size = map.getSize();
			size.x.should.equal(800);
			size.y.should.equal(600);
		});

		it('can change view', function (done) {
			map.setView(latlng, 5);

			map.getCenter().should.be.near(latlng);
			map.getZoom().should.be.equal(5);

			map.on('moveend', function () {
				map.getCenter().should.be.near(latlng);
				map.getZoom().should.be.equal(13);
				done();
			})
			map.setView(latlng, 13);
		});

		// although we tried to disable all animations
		// this fails sometimes
		it('map is pannable', function () {
			map.setView(latlng, 5);
			map.panBy([200, 0], {
				animate: false
			});

			var center = map.getCenter();
			center.lat.should.be.closeTo(lat, 0.1);
			center.lng.should.greaterThan(lng);
		});

		it('has a working saveImage() method', function (done) {
			map.setView([10, 10], 3).setSize(200, 200);

			L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
					'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
			}).addTo(map);

			L.polyline([[10, 10], [0, 0]], {
				renderer: canvas
			}).addTo(map);
			L.marker([10, 10]).addTo(map);

			var outfilename = path.join(__dirname, 'actual', 'test-saveimage.png');
			var expected = path.join(__dirname, 'expected', 'test-saveimage.png');

			map.saveImage(outfilename, function (filename) {
				filename.should.equal(outfilename);

				fs.existsSync(filename).should.be.true;
				setTimeout(function () {
					diff(expected, filename, done);

				}, 50);
			});
		});
	});

	describe('Adding layers', function () {
		it('L.Marker()', function () {
			map.setView(latlng, 10);

			var marker = L.marker(latlng).addTo(map);

			map.hasLayer(marker).should.be.true;
		});

		it('L.TileLayer()', function () {
			map.setView(latlng, 10);

			var tilelayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
					'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
			}).addTo(map);

			map.hasLayer(tilelayer).should.be.true;
		});

		it('L.Polyline()', function () {
			map.setView([52, 4], 10);

			var latlngs = [[52, 4], [54, 4], [54, 6], [52, 6], [52, 4]];
			var polyline = L.polyline(latlngs, {renderer: canvas}).addTo(map);
		});

		it('L.GeoJSON()', function () {
			var geojson = JSON.parse('{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"foo":"bar"},"geometry":{"type":"Point","coordinates":[2.63671875,65.87472467098549]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-14.765625,-3.864254615721396]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[4.74609375,45.706179285330855]}},{"type":"Feature","properties":{},"geometry":{"type":"LineString","coordinates":[[-13.18359375,46.437856895024225],[-8.96484375,49.83798245308484],[-5.09765625,43.83452678223684],[-30.41015625,38.272688535980976],[-32.34375,55.87531083569679],[-42.01171875,54.97761367069625],[-62.22656249999999,30.751277776257812]]}},{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-13.0078125,12.039320557540584],[-13.0078125,39.36827914916014],[16.5234375,29.99300228455108],[9.4921875,12.039320557540584],[-13.0078125,12.039320557540584]]]}}]}');

			map.setView(latlng, 5);

			var layer = L.geoJson(geojson, {renderer: canvas}).addTo(map);
			map.fitBounds(layer.getBounds(), {animate: false});
			map.getCenter().should.not.be.near(latlng);
			map.getZoom().should.be.equal(3);
		});
	});

	describe('Advanced functions', function () {
		function exampleRunner (example) {
			describe(example + ' example', function () {
				it('runs, wrote an image, equal to what we expected', function (done) {
					var filename = path.join(__dirname, 'actual', 'example-' + example + '.png');
					var expected = path.join(__dirname, 'expected', 'example-' + example + '.png');

					require('../examples/' + example + '/index.js')(filename, function (actual) {
						fs.existsSync(actual).should.be.true;
							diff(expected, actual, done);
					});
				});
			});
		}

		exampleRunner('leaflet-image');
		exampleRunner('choropleth');
	});

});

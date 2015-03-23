'use strict';

var fs = require('fs');
var L = require('../index.js');
var chai = require('chai');

require('chai-leaflet');
chai.should();

describe('Leaflet-headless', function () {
	var element, map;

	var lat = 52.4, lng = 4.5;
	var latlng = [lat, lng];

	beforeEach(function () {
		element = document.createElement('div');
		element.id = 'map';
		element.style.width = '1024px';
		element.style.height = '1024px';
		document.body.appendChild(element);

		map = L.map('map');
	});
	afterEach(function () {
		map.remove();
	});

	describe('Basic map functions', function () {
		it('has a size', function () {
			map.setView(latlng, 10);

			var size = map.getSize();
			size.x.should.equal(1024);
			size.y.should.equal(1024);
		});

		it('can change view', function () {
			map.setView(latlng, 5);

			map.getCenter().should.be.near(latlng);
			map.getZoom().should.be.equal(5);

			map.setView(latlng, 13);
			map.getCenter().should.be.near(latlng);
			map.getZoom().should.be.equal(13);
		});

		// although we tried to disable all animations
		// this fails sometimes
		it.skip('map is pannable', function () {
			map.setView(latlng, 5);

			map.panBy([200, 0]);

			var center = map.getCenter();
			center.lat.should.be.closeTo(lat, 0.1);
			center.lng.should.greaterThan(lng);
		});

		it('map with marker', function () {
			map.setView(latlng, 10);

			var marker = L.marker(latlng).addTo(map);

			map.hasLayer(marker).should.be.true;
		});
	});

	describe('Adding layers', function () {
		it('map with tilelayer', function () {
			map.setView(latlng, 10);

			L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
					'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
			}).addTo(map);
		});

		it('has working imagePath', function () {
			var path = L.Icon.Default.imagePath + '/';

			fs.existsSync(path + 'layers.png').should.be.true;
			fs.existsSync(path + 'marker-icon.png').should.be.true;
		});

		it('map with geojson', function () {
			var geojson = JSON.parse('{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"foo":"bar"},"geometry":{"type":"Point","coordinates":[2.63671875,65.87472467098549]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-14.765625,-3.864254615721396]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[4.74609375,45.706179285330855]}},{"type":"Feature","properties":{},"geometry":{"type":"LineString","coordinates":[[-13.18359375,46.437856895024225],[-8.96484375,49.83798245308484],[-5.09765625,43.83452678223684],[-30.41015625,38.272688535980976],[-32.34375,55.87531083569679],[-42.01171875,54.97761367069625],[-62.22656249999999,30.751277776257812]]}},{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-13.0078125,12.039320557540584],[-13.0078125,39.36827914916014],[16.5234375,29.99300228455108],[9.4921875,12.039320557540584],[-13.0078125,12.039320557540584]]]}}]}');

			map.setView(latlng, 5);

			var layer = L.geoJson(geojson).addTo(map);
			map.fitBounds(layer.getBounds());

			map.getCenter().should.not.be.near(latlng);
			map.getZoom().should.be.equal(3);
		});
	});

	describe('Advanced functions', function () {
		describe('examples', function () {
			var leafletImageExample = require('../examples/leaflet-image/index.js');

			it('runs + wrote to file', function (done) {
				leafletImageExample(function (testFilename) {
					fs.existsSync(testFilename).should.be.true;
					done();
				});
			});
			var choroplethExample = require('../examples/choropleth/index.js');

			it('runs + wrote to file', function (done) {
				choroplethExample(function (testFilename) {
					fs.existsSync(testFilename).should.be.true;
					done();
				});
			});
		});
	});
});

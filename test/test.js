'use strict';

var L = require('../index.js');
var chai = require('chai').should();

describe('Leaflet-headless', function () {

	describe('basic functions', function () {
		var element, map;

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

		it('has a size', function () {
			map.setView([52, 4], 10);

			var size = map.getSize();
			size.x.should.equal(1024);
			size.y.should.equal(1024);
		});

		it('map with marker', function () {
			map.setView([52, 4], 10);

			var marker = L.marker([52, 4]).addTo(map);

			map.hasLayer(marker).should.be.true;
		});

		it('is pannable', function () {
			var lat = 52,
			    lng = 4;

			map.setView([lat, lng], 5);

			map.panBy([200, 0]);

			var center = map.getCenter();
			center.lat.should.be.closeTo(lat, 0.1);
			center.lng.should.greaterThan(lng);
		});

		it('map with tilelayer', function () {
			map.setView([52, 4], 10);

			L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
					'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
			}).addTo(map);
		});

		it('has some working imagePath');

	});
});
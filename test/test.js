'use strict';

var L = require('../index.js');
var chai = require('chai').should();


describe('Leaflet-headless', function () {

	describe('basic functions', function () {

		it('has a size', function () {
			var element = document.createElement('div');
			element.id = 'map';

			document.body.appendChild(element);

			var map = L.map('map').setView([52, 4], 10);

			var size = map.getSize();
			size.x.should.equal(1024);
			size.y.should.equal(1024);
		});

		it('map with marker', function () {
			var map = L.map(document.createElement('div'));

			map.setView([52, 4], 10);

			var marker = L.marker([52, 4]).addTo(map);

			map.hasLayer(marker).should.be.true;
		});

		it('map with tilelayer', function () {
			var map = L.map(document.createElement('div'));

			map.setView([52, 4], 10);

			L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
			}).addTo(map);
		})

		it('has some working imagePath');

	});

});
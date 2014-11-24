/**
 * leaflet-headless
 *
 * Server side leaflet with fake DOM using jsdom.
 */

'use strict';

var fs = require('fs');
var request = require('request').defaults({
	encoding: null
});
var jsdom = require('jsdom').jsdom;

// make some globals to fake browser behaviour.
GLOBAL.document = jsdom('<html><head></head><body></body></html>');
GLOBAL.window = document.parentWindow;
GLOBAL.window.navigator.userAgent = 'webkit';
GLOBAL.navigator = GLOBAL.window.navigator;

// shim Image
var canvasImage = require('canvas').Image;
var imageShim = function imageShim() {};
imageShim.prototype.__defineSetter__('src', function (src) {
	var self = this;

	function buffer2image(buffer) {
		var image = new canvasImage();
		image.src = buffer;

		if (self.onload) {
			self.onload.apply(image);
		}
	}
	switch (src.substr(0, 7)) {
	case 'http://':
		request.get(src, function (err, res, buffer) {
			buffer2image(buffer);
		});
		break;
	case 'file://':
		// remove file://
		src = src.substr(7);
		// and query string
		if (src.indexOf('?') !== -1) {
			src = src.substr(0, src.indexOf('?'));
		}

		var buffer = fs.readFileSync(src);
		buffer2image(buffer);
		break;
	default:
		console.error('what to do? ' + src);
	}
});

GLOBAL.Image = imageShim;

GLOBAL.L_DISABLE_3D = true;

var L = require('leaflet');

// make L global too
GLOBAL.L = L;

var leafletPath = require.resolve('leaflet');
L.Icon.Default.imagePath = leafletPath.substring(0, leafletPath.length - 'leaflet-src.js'.length) + 'images';

// monkeypatch map.getSize to make it work with fixed 1024x1024 elements
// jsdom appears to not have clientHeight/clientWidth on elements
L.Map.prototype.getSize = function () {
	return L.point(1024, 1024);
};

module.exports = L;

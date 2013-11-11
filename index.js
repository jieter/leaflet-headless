/**
 * leaflet-headless
 *
 * Server side leaflet with fake DOM using jsdom.
 */

'use strict';

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
imageShim.prototype.__defineSetter__('src', function (url) {
	var self = this;
	request.get(url, function (err, res, buffer) {
		var image = new canvasImage();
		image.src = buffer;

		if (self.onload) {
			self.onload.apply(image);
		}
	});
});

GLOBAL.Image = imageShim;

GLOBAL.L_DISABLE_3D = true;

var L = require('leaflet');

// make L global too
GLOBAL.L = L;

// TODO: fix this to make it actually work.
L.Icon.Default.imagePath = L.Util.emptyImageUrl;

// monkeypatch map.getSize to make it work with fixed 1024x1024 elements
// jsdom appears to not have clientHeight/clientWidth on elements
L.Map.prototype.getSize = function () {
	return L.point(1024, 1024);
};

module.exports = L;
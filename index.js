/**
 * leaflet-headless
 *
 * Server side leaflet with fake DOM using jsdom.
 */

'use strict';

var jsdom = require('jsdom').jsdom;

// make some globals to fake browser behaviour.
GLOBAL.document = jsdom('<html><head></head><body></body></html>');
GLOBAL.window = document.parentWindow;
GLOBAL.window.navigator.userAgent = 'webkit';
GLOBAL.navigator = GLOBAL.window.navigator;
GLOBAL.Image = require('./src/image.js');

var leafletSrc = './lib/leaflet/leaflet-src.js' || require.resolve('leaflet');

GLOBAL.L_DISABLE_3D = true;
var L = require(leafletSrc);
GLOBAL.L = L;


L.Icon.Default.imagePath = leafletSrc.substring(0, leafletSrc.length - 10) + 'images';

// monkeypatch map.getSize to make it work with fixed 1024x1024 elements
// jsdom does not have clientHeight/clientWidth on elements
L.Map.prototype.getSize = function () {
	return L.point(1024, 1024);
};

module.exports = L;
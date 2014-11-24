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
GLOBAL.Image = require('./src/image.js');

// Load leaflet
GLOBAL.L_DISABLE_3D = true;
GLOBAL.L_PREFER_CANVAS = true
var L = require('leaflet');
GLOBAL.L = L;

var leafletPath = require.resolve('leaflet');
var scriptLength = leafletPath.split('/').slice(-1)[0].length;
L.Icon.Default.imagePath = leafletPath.substring(0, leafletPath.length - scriptLength) + 'images';

// monkeypatch map.getSize to make it work with fixed 1024x1024 elements
// jsdom appears to not have clientHeight/clientWidth on elements
L.Map.prototype.getSize = function () {
	return L.point(1024, 1024);
};

module.exports = L;

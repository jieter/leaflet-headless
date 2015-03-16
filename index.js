/**
 * leaflet-headless
 *
 * Server side leaflet with fake DOM using jsdom.
 */

var jsdom = require('jsdom').jsdom;

if (!GLOBAL.L) {
	// make some globals to fake browser behaviour.
	GLOBAL.document = jsdom('<html><head></head><body></body></html>');
	GLOBAL.window = GLOBAL.document.defaultView;
	GLOBAL.window.navigator.userAgent = 'webkit';
	GLOBAL.navigator = GLOBAL.window.navigator;
	GLOBAL.Image = require('./src/image.js');

	// Load leaflet
	GLOBAL.L_DISABLE_3D = true;
	GLOBAL.L_PREFER_CANVAS = true;

	var leafletPath = require.resolve('leaflet');
	var L = require(leafletPath);
	GLOBAL.L = L;

	var scriptLength = leafletPath.split('/').slice(-1)[0].length;
	L.Icon.Default.imagePath = leafletPath.substring(0, leafletPath.length - scriptLength) + 'images';

	// Monkey patch map.getSize to make it work with fixed 1024x1024 elements
	// jsdom appears to not have clientHeight/clientWidth on elements
	L.Map.prototype.getSize = function () {
		return L.point(1024, 1024);
	};

	// Monkey patch Map to disable animations.
	var originalMap = L.Map;
	L.Map = originalMap.extend({
		initialize: function (id, options) {
			options = L.extend(options || {}, {
				animate: false,
				fadeAnimation: false,
				zoomAnimation: false,
				markerZoomAnimation: false
			});
			return originalMap.prototype.initialize.call(this, id, options);
		}
	});
}

module.exports = GLOBAL.L;

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

    GLOBAL.L_DISABLE_3D = true;
    GLOBAL.L_PREFER_CANVAS = true;

    var leafletPath = require.resolve('leaflet');
    var L = require(leafletPath);
    GLOBAL.L = L;

    var scriptLength = leafletPath.split('/').slice(-1)[0].length;
    L.Icon.Default.imagePath = leafletPath.substring(0, leafletPath.length - scriptLength) + 'images';

    // Monkey patch Leaflet
    var originalMap = L.Map;
    L.Map = originalMap.extend({
        // Override initialize to disable animations.
        initialize: function (id, options) {
            options = L.extend(options || {}, {
                fadeAnimation: false,
                zoomAnimation: false,
                markerZoomAnimation: false
            });

            return originalMap.prototype.initialize.call(this, id, options);
        },

        // jsdom does not have clientHeight/clientWidth on elements.
        // Adjust size with L.Map.setSize()
        getSize: function () {
            if (!this._size || this._sizeChanged) {
                this._size = new L.Point(1024, 1024);
                this._sizeChanged = false;
            }
            return this._size.clone();
        },

        setSize: function (width, height) {
            this._size = new L.Point(width, height);
            // reset pixelOrigin
            this._resetView(this.getCenter(), this.getZoom());
            return this;
        },

        saveImage: function (outfilename, callback) {
            var leafletImage = require('leaflet-image');
            var fs = require('fs');
            leafletImage(this, function (err, canvas) {
                if (err) {
                    console.error(err);
                    return;
                }
                var out = fs.createWriteStream(outfilename);
                var stream = canvas.pngStream();

                stream.on('data', function (chunk) {
                    out.write(chunk);
                });

                stream.on('end', function () {
                    if (callback) {
                        callback(outfilename);
                    }
                });
            });
        }
    });

    // leaflet-image checks for instanceof(layer, L.TileLayer.Canvas)
    // which is not in leaflet-1.0.0-beta.*, this makes the tests work.
    // TODO: remove if this is fixed upstream in leaflet-image
    L.TileLayer.Canvas = function () {};
}

module.exports = GLOBAL.L;

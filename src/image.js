/*
 * Sort of working Image implementation for jsdom, supporting
 * http, https, and file urls.
 */

var fs = require('fs');
var request = require('request').defaults({
    encoding: null
});

var CanvasImage = require('canvas').Image;

function stripQuerystring (url) {
    if (url.indexOf('?') !== -1) {
        url = url.substr(0, url.indexOf('?'));
    }
    return url;
}

var Image = function Image () {};
Image.prototype.__defineSetter__('src', function (src) {
    var self = this;

    function buffer2image (buffer) {
        var image = new CanvasImage();
        image.src = buffer;

        if (self.onload) {
            self.onload.apply(image);
        }
    }
    switch (src.substr(0, 7)) {
    case 'https:/':
    case 'http://':
        request.get(src, function (err, res, buffer) {
            if (err) {
                console.error('Could not get url', err);
                return;
            }

            buffer2image(buffer);
        });
        break;
    case 'file://':
        // strip off file://
        src = src.substr(7);

    default: // fallthrough
        src = stripQuerystring(src);

        fs.exists(src, function (exists) {
            if (!exists) {
                console.error('Could not find image ', src);
                return;
            }

            fs.readFile(src, function (err, buffer) {
                if (err) {
                    console.err(err);
                    return;
                }
                buffer2image(buffer);
            });
        });
        break;
        // console.error('Image not implemented for url: ' + src);
    }
});

module.exports = Image;

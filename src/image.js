/*
 * Sort of working Image implementation for jsdom, supporting
 * http, https, and file urls.
 */

var fs = require('fs');
var request = require('request').defaults({
	encoding: null
});

var CanvasImage = require('canvas').Image;

var Image = function Image() {};
Image.prototype.__defineSetter__('src', function (src) {
	var self = this;

	function buffer2image(buffer) {
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
		fs.exists(src, function (exists) {
			if (exists) {
				fs.readFile(src, function (err, buffer) {
					buffer2image(buffer);
				});
			} else {
				console.error('Could not find image ', src);
			}
		});
		break;
	default:
		console.error('Image not implemented for url: ' + src);
	}
});

module.exports = Image;

var fs = require('fs');
var path = require('path');

var PNG = require('pngjs').PNG;
var pixelmatch = require('pixelmatch');

function diff (expected, actual, callback) {

    var diffdir = __dirname;
    if (process.env.CIRCLE_ARTIFACTS) {
        diffdir = process.env.CIRCLE_ARTIFACTS;
    }
    var diffoutput = path.join(diffdir, 'diff-' + path.basename(actual));

    var filesRead = 0;
    var img1 = fs.createReadStream(expected).pipe(new PNG()).on('parsed', doneReading);
    var img2 = fs.createReadStream(actual).pipe(new PNG()).on('parsed', doneReading);

    function doneReading() {
        if (++filesRead < 2) return;
        var imgDiff = new PNG({ width: img1.width, height: img1.height });
        var totalPixels = img1.width * img1.height;
        var pixelsMismatched = pixelmatch(img1.data, img2.data, imgDiff.data, img1.width, img1.height, { threshold: 0.1 });
        var pctMismatched = (pixelsMismatched / totalPixels) * 100;

        imgDiff.pack().pipe(fs.createWriteStream(diffoutput));

        if (pixelsMismatched > 0) {
            console.log(
                'Image not equal to expected image in ' + expected + ', ' +
                'by ' + pixelsMismatched + ' out of ' + totalPixels + 'pixels (' + pctMismatched + '%). ' +
                'Diff in ' + diffoutput
            );
        }
        callback(pctMismatched);
    }
}

module.exports = function () {
    // wait a tiny bit of time before starting the diff to make sure the PNG
    // is not corrupt.
    var args = arguments;
    setTimeout(function () {
        diff.apply(this, args);
    }, 50);
}

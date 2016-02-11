var path = require('path');

var imageDiff = require('image-diff');

function diff (expected, actual, callback) {

    var diffdir = __dirname;
    if (process.env.CIRCLE_ARTIFACTS) {
        diffdir = process.env.CIRCLE_ARTIFACTS;
    }
    var diffoutput = path.join(diffdir, 'diff-' + path.basename(actual));

    imageDiff({
        actualImage: actual,
        expectedImage: expected,
        diffImage: diffoutput
    }, function (err, equal) {
        if (err) {
            throw err;
        }
        if (!equal) {
            console.log(
                'Image not equal to expected image in ' + expected + ', ' +
                'diff in ' + diffoutput
            );
        }
        callback();
    });
}

module.exports = function () {
    // wait a tiny bit of time before starting the diff to make sure the PNG
    // is not corrupt.
    var args = arguments;
    setTimeout(function () {
        diff.apply(this, args);
    }, 50);
}

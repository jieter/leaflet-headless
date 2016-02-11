/**
 * Clustering example from
 * https://github.com/rclark/server-side-leaflet/blob/master/clustering.js
 *
 * Needs a sample-data.geojson (27M)
 * https://github.com/rclark/server-side-leaflet/blob/master/sample-data.geojson)
 */

'use strict';

var fs = require('fs');
var L = require('../../index.js');
var document = GLOBAL.document;

require('leaflet.markercluster');

function cluster (zoom, callback) {
	callback = callback || function () {};

	fs.readFile('sample-data.geojson', function (err, content) {
		if (err) {
			console.error(err);
			return;
		}
		var data = JSON.parse(content);

		var map = L.map(document.createElement('div'), {maxZoom: 12})
		           .setView([38.5438691758, -92.5433345], zoom);

		var dataLayer = L.geoJson(data);
		var clusterLayer = new L.MarkerClusterGroup();

		map.addLayer(clusterLayer);
		clusterLayer.addLayer(dataLayer);

		var features = clusterLayer._featureGroup.getLayers().map(function (cluster) {
			var f = cluster.toGeoJSON();
			f.properties = {};
			f.properties.featureCount = cluster.__parent.getChildCount();
			return f;
		});

		callback({
			type: 'FeatureCollection',
			features: features
		});
	});
}

if (require.main === module) {
	cluster(9, function (geojson) {
		process.stdout.write(JSON.stringify(geojson));
	});
} else {
	module.exports = cluster;
}

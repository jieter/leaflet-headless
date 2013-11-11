/**
 * Needs a sample-data.geojson in
 */
var fs = require('fs');
var L = require('../../index.js');

require('leaflet.markercluster')(L);

function cluster(zoom, callback) {
    callback = callback || function () {};

    fs.readFile('sample-data.geojson', function (err, content) {
        var data = JSON.parse(content);

        var map = L.map(document.createElement('div'), {
                center: [38.543869175876154, -92.5433349609375],
                zoom: zoom,
                maxZoom: 12
            }),

            dataLayer = L.geoJson(data),
            clusterLayer = new L.MarkerClusterGroup();

        map.addLayer(clusterLayer);
        clusterLayer.addLayer(dataLayer);

        var features = clusterLayer._featureGroup.getLayers().map(function (cluster) {
            var f = cluster.toGeoJSON();
            f.properties = {};
            f.properties.featureCount = cluster.__parent.getChildCount();
            return f;
        });

        callback({
            type: "FeatureCollection",
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
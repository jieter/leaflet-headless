Leaflet-headless
----------------

[Leaflet](http://leafletjs.com) for node.

 - Has Leaflet as dependency.
 - Uses [jsdom](https://github.com/tmpvar/jsdom) to fake ad DOM.
 - Tiles, Markers and Path layers work well with [leaflet-image](https://github.com/mapbox/leaflet-image)
 - Currently fixed to 1024x1024 map size.

### Example

Run `npm install leaflet-headless` to install the package. Requiring `leaflet-headless` will introduce a global `L` which just works like in the browser.

```JavaScript
var L = require('leaflet-headless');

var map = L.map(document.createElement('div'));

map.setView([52, 4], 10);

var marker = L.marker([52, 4]).addTo(map);
```

Other examples:
 - `examples/leaflet-image/`, using [leaflet-image](https://github.com/mapbox/leaflet-image) to output a `.png`.
 - `examples/leaflet-markercluster`, using [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster) to output clusters to stdout.
 - `examples/choropleth/`, [Choropleth tutorial from leafletjs.com](http://leafletjs.com/examples/choropleth.html) using [leaflet-image](https://github.com/mapbox/leaflet-image) to output a `.png`.

For these to work, you'll need to run `npm install` in both the root of the repository and in the example directory.

```
~/leaflet-headless$ npm install
[...]
~/leaflet-headless$ cd examples/leaflet-image/
~/leaflet-headless/examples/leaflet-image/$ npm install
[...]
~/leaflet-headless/examples/leaflet-image/$ node index.js
Save to image using leaflet-image...
Saved test.png
```

### Attribution
This is inspired by https://github.com/rclark/server-side-leaflet.
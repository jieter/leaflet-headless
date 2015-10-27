Leaflet-headless
----------------

[Leaflet](http://leafletjs.com) for node.

 - Has Leaflet as dependency.
 - Uses [jsdom](https://github.com/tmpvar/jsdom) to fake ad DOM.
 - Uses [canvas](https://github.com/LearnBoost/node-canvas) `Image` implementation to fake images. Note that node-canvas needs some dependencies to be installed: for ubuntu: `sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++`
 - Tiles, Markers and Path layers work well with [leaflet-image](https://github.com/mapbox/leaflet-image)
 - Currently fixed to 1024x1024 map size.
 - It's slow (~4s for the `examples/choropleth/` on my machine).


### Run tests

`npm test`


### Example

Run `npm install leaflet-headless` to install the package. Requiring `leaflet-headless` will introduce a global `L` which just works like in the browser.

```JavaScript
var L = require('leaflet-headless');

var map = L.map(document.createElement('div')).setView([52, 4], 10);

var marker = L.marker([52, 4]).addTo(map);
```

For vector layers, make sure to use the canvas renderer if you want to use `leaflet-image`:

```JavaScript
var L = require('leaflet-headless');

var map = L.map(document.createElement('div')).setView([52, 4], 10);
var canvas = L.canvas();

var latlngs = [[52, 4], [54, 4], [54, 6], [52, 6], [52, 4]];
var polyline = L.polyline(latlngs, {renderer: canvas}).addTo(map);
```


Other examples:
 - `examples/leaflet-image/`, using [leaflet-image](https://github.com/mapbox/leaflet-image) to output a `.png`.
 - `examples/leaflet-markercluster`, using [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster) to output clusters to stdout.
 - `examples/choropleth/`, [Choropleth tutorial from leafletjs.com](http://leafletjs.com/examples/choropleth.html) using [leaflet-image](https://github.com/mapbox/leaflet-image) to output a `.png`.

```
~/leaflet-headless$ npm install
[...]
~/leaflet-headless$ cd examples/leaflet-image/
~/leaflet-headless/examples/leaflet-image/$ node index.js
Save to image using leaflet-image...
Saved test.png
```

### Attribution
This is inspired by https://github.com/rclark/server-side-leaflet.

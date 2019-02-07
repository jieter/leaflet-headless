Leaflet-headless
----------------

** This fork upgrades to canvas 2.3 and jsdom 13.2, which simplifies running in AWS lambda
   because canvas > 2.0 includes necessary binaries out of the box without needing to install cairo.

   Note: You will still need to install the lib on linux (or a linux Docker container) to run in lambda
         https://github.com/Automattic/node-canvas/issues/1231

[Leaflet](http://leafletjs.com) for node.

 - Has Leaflet 1.4.x as dependency.
 - Uses [jsdom](https://github.com/tmpvar/jsdom) to fake ad DOM.
 - Uses `Image` implementation and canvas from [canvas](https://github.com/LearnBoost/node-canvas).
 - Tiles, Markers and vector layers work well with [leaflet-image](https://github.com/mapbox/leaflet-image)
 - It's slow (~4s for the `examples/choropleth/` on my machine).


### Example

Run `npm install leaflet-headless` to install the package. Requiring `leaflet-headless` will introduce a global `L` which just works like in the browser.

For vector layers, make sure to use the canvas renderer if you want to use `leaflet-image`:

```JavaScript
var L = require('leaflet-headless');

var map = L.map(document.createElement('div')).setView([52, 4], 10);

var marker = L.marker([52, 4]).addTo(map);

var latlngs = [[52, 4], [54, 4], [54, 6], [52, 6], [52, 4]];
var polyline = L.polyline(latlngs).addTo(map);
```

### Setting map size

Because jsdom does not support `clientWidth`/`clientHeight`, `leaflet-headless` defaults to a map size of 1024x1024px. To adjust this size, use `L.Map.setSize(width, height)`.

```JavaScript
map.setSize(800, 600);
```

### Saving images

`leaflet-headless` adds a convenience function to `L.Map` to save the current map to an image using `leaflet-image`.

`L.Map.saveImage(filename, callback)`: Save image to `filename` and call `callback` when ready.

```JavaScript
map.saveImage('test.png', function (filename) {
    console.log('Saved map image to ' + filename);
});
```

### Other examples:
 - `examples/leaflet-image/`, using [leaflet-image](https://github.com/mapbox/leaflet-image) to output a `.png`.
 - `examples/choropleth/`, [Choropleth tutorial from leafletjs.com](http://leafletjs.com/examples/choropleth.html) using [leaflet-image](https://github.com/mapbox/leaflet-image) to output a `.png`.
 - `examples/mapbox-geojson`, use [mapbox.js](https://github.com/mapbox/mapbox.js) to render a GeoJSON file with [simplestyle](https://github.com/mapbox/simplestyle-spec) styling.

```
~/leaflet-headless$ npm install
[...]
~/leaflet-headless$ cd examples/leaflet-image/
~/leaflet-headless/examples/leaflet-image/$ node index.js
Save to image using leaflet-image...
Saved test.png
```

### Run tests

`npm test`

### Attribution
This is inspired by https://github.com/rclark/server-side-leaflet.

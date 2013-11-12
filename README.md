Leaflet-headless
----------------

[Leaflet](http://leafletjs.com) for node, cleaned up version of https://github.com/rclark/server-side-leaflet.
This does not include the actual leaflet code but has it as a dependency.

## Limitations / known issues
 - Currently fixed to 1024x1024 map size.

## Example

```JavaScript
var L = require('leaflet-headless');

var map = L.map(document.createElement('div'));

map.setView([52, 4], 10);

var marker = L.marker([52, 4]).addTo(map);
```
Other examples:
 - `examples/leaflet-image/`, using [leaflet-image](https://github.com/mapbox/leaflet-image) to output a `.png`.

 - `examples/leaflet-markercluster`, using [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster) to output clusters to stdout.

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



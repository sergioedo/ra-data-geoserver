This is a sample react-admin app using GeoServer data provider.

# Run

To run it locally, you need a GeoServer backend. You can launch it with docker:

```
docker run -d -p 8080:8080 oscarfonts/geoserver
```

Then you can launch the app with:

```
npm start
```

In this sample you can test 3 different features, with Point, MultiLineString and MultiPolygon geometries.

# Known limitations/issues

-   Editor component (react-leaflet-draw) is buggy (editing line/polygon vertexs don't render correctly). Workaround is cancel the edit (first time) and start again.
-   On edit, MultiGeometries are reduced to a single geometry (the first one).

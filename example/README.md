This is a sample react-admin app using GeoServer data provider.

# Run

To run it locally, you need a GeoServer backend. You can launch it with docker:

```
docker run -d -p 8080:8080 oscarfonts/geoserver
```

You must configure environment variables. Copy '.env.example' to '.env.local' and adjust if necessary ('.env.example' is ready to connect to previous local geoserver with docker)

```
cp .env.example .env.local
```

To avoid CORS problems between ReactAdmin app (port 3000) and Geoserver (port 8080), [CRA proxy](https://create-react-app.dev/docs/proxying-api-requests-in-development/) is configured in [package.json](package.json), to redirect API calls to GeoServer:

```
// package.json
...
"proxy": "http://localhost:8080",
...
```

Then you can launch the app with:

```
npm start
```

In this sample you can test 3 different features, with Point, MultiLineString and MultiPolygon geometries.

# Known limitations/issues

- Editor component (react-leaflet-draw) is buggy (editing line/polygon vertexs don't render correctly). Workaround is cancel the edit (first time) and start again.
- On edit, MultiGeometries are reduced to a single geometry (the first one).
- Working with GeoServer sample data (shapefiles), has limitations (on insert no id returned, and don't support concurrency, for example on multiple delete only delete 1 element)

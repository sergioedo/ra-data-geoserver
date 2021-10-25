import * as React from "react"
import { useField } from "react-final-form"
import {
    MapContainer,
    TileLayer,
    Marker,
    // Popup,
    FeatureGroup,
} from "react-leaflet"
import { EditControl } from "react-leaflet-draw"

const GeometryInput = ({
    source = "geometry",
    defaultCenterLatLon = [41.390205, 2.154007],
    defaultZoom = 16,
}) => {
    const { input: geometryInput } = useField(source)

    const handleCreatedGeometry = ({ layer, layerType }) => {
        if (layerType === "marker") {
            geometryInput.onChange({
                type: "Point",
                coordinates: [layer.getLatLng().lng, layer.getLatLng().lat],
            })
        }
    }
    const handleEditedGeometry = ({ layers }) => {
        const layer = layers.getLayers()[0] // get unique layer
        geometryInput.onChange({
            type: "Point",
            coordinates: [layer.getLatLng().lng, layer.getLatLng().lat],
        })
    }

    const lat = geometryInput.value
        ? geometryInput.value.coordinates[1]
        : defaultCenterLatLon[0]
    const lon = geometryInput.value
        ? geometryInput.value.coordinates[0]
        : defaultCenterLatLon[1]

    return (
        <MapContainer
            style={{ height: "350px", width: "100%" }}
            center={[lat, lon]}
            zoom={defaultZoom}
            scrollWheelZoom={true}
        >
            <FeatureGroup>
                <EditControl
                    position="topright"
                    onCreated={handleCreatedGeometry}
                    onEdited={handleEditedGeometry}
                    draw={{
                        circle: false,
                        circlemarker: false,
                        marker: {},
                        polygon: false,
                        polyline: false,
                        rectangle: false,
                    }}
                />
                {geometryInput.value && <Marker position={[lat, lon]} />}
            </FeatureGroup>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </MapContainer>
    )
}

export default GeometryInput

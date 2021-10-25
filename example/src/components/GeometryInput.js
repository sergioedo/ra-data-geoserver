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

const GeometryInput = ({ source = "geometry" }) => {
    const { input: geometryInput } = useField(source)

    const handleEditedGeometry = ({ layers }) => {
        const layer = layers.getLayers()[0] // get unique layer
        geometryInput.onChange({
            type: "Point",
            coordinates: [layer.getLatLng().lng, layer.getLatLng().lat],
        })
    }

    const lat = geometryInput.value.coordinates[1]
    const lon = geometryInput.value.coordinates[0]

    return (
        <MapContainer
            style={{ height: "350px", width: "100%" }}
            center={[lat, lon]}
            zoom={16}
            scrollWheelZoom={true}
        >
            <FeatureGroup>
                <EditControl
                    position="topright"
                    onEdited={handleEditedGeometry}
                    draw={{
                        circle: false,
                        circlemarker: false,
                        marker: false,
                        polygon: false,
                        polyline: false,
                        rectangle: false,
                    }}
                />
                <Marker position={[lat, lon]} />
            </FeatureGroup>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </MapContainer>
    )
}

export default GeometryInput

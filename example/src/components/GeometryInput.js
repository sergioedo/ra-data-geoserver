import * as React from "react"
import { useField } from "react-final-form"
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet"
import { EditControl } from "react-leaflet-draw"
import { getPosition } from "../utils"
import GeometryLayer from "./GeometryLayer"

const getDrawOptions = (type) => {
    return {
        circle: false,
        circlemarker: false,
        marker: type.endsWith("Point") ? {} : false,
        polygon: type.endsWith("Polygon") ? {} : false,
        polyline: type.endsWith("LineString") ? {} : false,
        rectangle: false,
    }
}

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

    const position = geometryInput.value
        ? getPosition(geometryInput.value)
        : defaultCenterLatLon

    console.log(geometryInput.value.type)
    return (
        <MapContainer
            style={{ height: "350px", width: "100%" }}
            center={position}
            zoom={defaultZoom}
            scrollWheelZoom={true}
        >
            <FeatureGroup>
                <EditControl
                    position="topright"
                    onCreated={handleCreatedGeometry}
                    onEdited={handleEditedGeometry}
                    draw={getDrawOptions(geometryInput.value.type)}
                />
                <GeometryLayer geometry={geometryInput.value} />
            </FeatureGroup>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </MapContainer>
    )
}

export default GeometryInput

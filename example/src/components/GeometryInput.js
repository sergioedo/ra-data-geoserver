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

const normalizeMultiGeometry = ({ geometry, geometryType }) => {
    const isMultiGeometry = geometry.type.startsWith("Multi")
    const isMultiGeometryType = geometryType.startsWith("Multi")
    if (isMultiGeometryType && !isMultiGeometry) {
        // Convert simple geometry to multigeometry
        return {
            type: geometryType,
            coordinates: [geometry.coordinates],
        }
    }
    if (!isMultiGeometryType && isMultiGeometry) {
        // Convert multigeometry to simple geometry (reduce to first geometry)
        return {
            type: geometryType,
            coordinates: geometry[0],
        }
    }
    return geometry
}

const reduceToSimpleGeometry = (geometry) => {
    const isMultiGeometry = geometry.type.startsWith("Multi")
    if (isMultiGeometry) {
        // Convert multigeometry to simple geometry (reduce to first geometry)
        return {
            type: geometry.type.substring(5),
            coordinates: geometry.coordinates[0],
        }
    }
    return geometry
}

const GeometryInput = ({
    source = "geometry",
    geometryType = "Point",
    defaultCenterLatLon = [41.390205, 2.154007],
    defaultZoom = 16,
}) => {
    const { input: geometryInput } = useField(source)

    const geomType = geometryInput.value
        ? geometryInput.value.type
        : geometryType
    const position = geometryInput.value
        ? getPosition(geometryInput.value)
        : defaultCenterLatLon

    const handleCreatedGeometry = ({ layer, layerType }) => {
        if (!layer) return
        const geojson = layer.toGeoJSON()
        const normGeometry = normalizeMultiGeometry({
            geometry: geojson.geometry,
            geometryType: geomType,
        })
        geometryInput.onChange(normGeometry)
    }
    const handleEditedGeometry = ({ layers }) => {
        const layer = layers.getLayers()[0] // get unique layer
        if (!layer) return
        const geojson = layer.toGeoJSON()
        const normGeometry = normalizeMultiGeometry({
            geometry: geojson.geometry,
            geometryType: geomType,
        })
        geometryInput.onChange(normGeometry)
    }

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
                    draw={getDrawOptions(geomType)}
                    edit={{
                        selectedPathOptions: {
                            maintainColor: true,
                            opacity: 0.3,
                        },
                    }}
                />
                <GeometryLayer
                    geometry={reduceToSimpleGeometry(geometryInput.value)}
                    geometryType={geomType}
                />
            </FeatureGroup>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </MapContainer>
    )
}

export default GeometryInput

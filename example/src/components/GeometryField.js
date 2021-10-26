import * as React from "react"
import { useRecordContext } from "react-admin"
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet"

const reverseCoordinates = (coordinates) => {
    if (!Array.isArray(coordinates[0])) {
        // Point --> lat,lon
        return [coordinates[1], coordinates[0]]
    } else {
        // Lines, Polygons...
        return coordinates.map((geometry) => {
            if (Array.isArray(geometry) && Array.isArray(geometry[0])) {
                // MultiGeometry
                return geometry.map((coords) => {
                    return [coords[1], coords[0]]
                })
            } else if (Array.isArray(geometry)) {
                //Single Geometry
                return [geometry[1], geometry[0]]
            } else {
                return geometry
            }
        })
    }
}

const getPosition = (geometry) => {
    const coordinates = reverseCoordinates(geometry.coordinates)
    if (!Array.isArray(coordinates[0])) {
        // Point
        return coordinates
    } else {
        // LineString, Polygons...
        // TODO: calculate bounds and center (now returns first geometry point)
        if (Array.isArray(coordinates) && Array.isArray(coordinates[0])) {
            return coordinates[0][0]
        } else {
            return coordinates[0]
        }
    }
}

const GeometryLayer = ({ geometry }) => {
    if (geometry.type === "Point") {
        return <Marker position={getPosition(geometry)} />
    } else if (geometry.type.endsWith("LineString")) {
        return <Polyline positions={reverseCoordinates(geometry.coordinates)} />
    }
}

const GeometryField = ({ source = "geometry" }) => {
    const { record } = useRecordContext()
    const position = getPosition(record.geometry)

    return (
        <MapContainer
            style={{ height: "350px", width: "100%" }}
            center={position}
            zoom={16}
            scrollWheelZoom={true}
        >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeometryLayer geometry={record.geometry} />
        </MapContainer>
    )
}

export default GeometryField

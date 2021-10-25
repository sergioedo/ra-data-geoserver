import * as React from "react"
import { useRecordContext } from "react-admin"
import { MapContainer, TileLayer, Marker } from "react-leaflet"

const GeometryField = ({ source = "geometry" }) => {
    const { record } = useRecordContext()

    const lat = record.geometry.coordinates[1]
    const lon = record.geometry.coordinates[0]

    return (
        <MapContainer
            style={{ height: "350px", width: "100%" }}
            center={[lat, lon]}
            zoom={16}
            scrollWheelZoom={true}
        >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[lat, lon]} />
        </MapContainer>
    )
}

export default GeometryField

import * as React from "react"
import { useRecordContext } from "react-admin"
import { MapContainer, TileLayer } from "react-leaflet"
import GeometryLayer from "./GeometryLayer"
import { getPosition } from "../utils"

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
            <GeometryLayer
                geometry={record.geometry}
                geometryType={record.geometry.type}
            />
        </MapContainer>
    )
}

export default GeometryField

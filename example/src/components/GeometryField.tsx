import * as React from "react"
import { useRecordContext } from "ra-core"
import { MapContainer, TileLayer } from "react-leaflet"
import GeometryLayer from "./GeometryLayer"
import { getPosition } from "../utils"

const GeometryField = (props) => {
    const { source = "geometry" } = props
    const record = useRecordContext(props)
    console.log({ record })
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
                geometry={record[source]}
                geometryType={record[source].type}
            />
        </MapContainer>
    )
}

export default GeometryField

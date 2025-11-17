import { Marker, Polyline, Polygon } from "react-leaflet"
import { getPosition, reverseCoordinates } from "../utils"

const GeometryLayer = ({ geometry, geometryType }) => {
    console.log({ geometry, geometryType })
    if (geometryType === "Point") {
        const g = geometry ? geometry : { coordinates: [0, 0] }
        return <Marker position={getPosition(g)} />
    } else if (geometryType.endsWith("LineString")) {
        const g = geometry ? reverseCoordinates(geometry.coordinates) : []
        return <Polyline positions={g} />
    } else if (geometryType.endsWith("Polygon")) {
        const g = geometry ? reverseCoordinates(geometry.coordinates) : []
        return <Polygon positions={g} />
    }
}

export default GeometryLayer

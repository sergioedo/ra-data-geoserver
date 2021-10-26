import { Marker, Polyline } from "react-leaflet"
import { getPosition, reverseCoordinates } from "../utils"

const GeometryLayer = ({ geometry }) => {
    if (geometry.type === "Point") {
        return <Marker position={getPosition(geometry)} />
    } else if (geometry.type.endsWith("LineString")) {
        return <Polyline positions={reverseCoordinates(geometry.coordinates)} />
    }
}

export default GeometryLayer

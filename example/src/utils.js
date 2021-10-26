export const reverseCoordinates = (coordinates) => {
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

export const getPosition = (geometry) => {
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

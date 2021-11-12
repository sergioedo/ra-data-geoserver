export const reverseCoordinates = (coordinates) => {
    if (Array.isArray(coordinates[0])) {
        // recursive
        return coordinates.map(reverseCoordinates)
    } else {
        //simple case, return reversed coordinates
        return [coordinates[1], coordinates[0]]
    }
}

const getFirstCoord = (coordinates) => {
    if (Array.isArray(coordinates[0])) {
        // recursive
        return getFirstCoord(coordinates[0])
    } else {
        //simple case, return first coordinate
        return coordinates
    }
}

export const getPosition = (geometry) => {
    const coordinates = reverseCoordinates(geometry.coordinates)
    // TODO: calculate bounds and center (now returns first geometry point)
    return getFirstCoord(coordinates)
}

const getGMLGeometry = (geometry) => {
    console.log({ geometry })
    if (geometry.type === "Point") {
        return `<gml:Point srsName="http://www.opengis.net/gml/srs/epsg.xml#4326">
                    <gml:coordinates xmlns:gml="http://www.opengis.net/gml" decimal="." cs="," ts=" ">
                        ${geometry.coordinates[0]},${geometry.coordinates[1]}
                    </gml:coordinates>
                </gml:Point>`
    } else if (geometry.type === "MultiLineString") {
        return `<gml:MultiLineString srsName="http://www.opengis.net/gml/srs/epsg.xml#4326">
                ${geometry.coordinates
                    .map(
                        (subGeometry) => `    
                    <gml:lineStringMember>
                        <gml:LineString>
                            <gml:coordinates xmlns:gml="http://www.opengis.net/gml" decimal="." cs="," ts=" ">
                                ${subGeometry
                                    .map((c) => `${c[0]},${c[1]}`)
                                    .join(" ")}
                            </gml:coordinates>
                        </gml:LineString>
                    </gml:lineStringMember>
                    `
                    )
                    .join("")}
                </gml:MultiLineString>`
    } else if (geometry.type === "MultiPolygon") {
        geometry.coordinates.map((subGeometry) => console.log({ subGeometry }))
        return `<gml:MultiPolygon srsName="http://www.opengis.net/gml/srs/epsg.xml#4326">
                ${geometry.coordinates
                    .map(
                        (subGeometry) => `
                    <gml:polygonMember>
                        <gml:Polygon>
                            <gml:outerBoundaryIs>
                                <gml:LinearRing>
                                    <gml:coordinates xmlns:gml="http://www.opengis.net/gml" decimal="." cs="," ts=" ">
                                        ${subGeometry[0] // outer ring
                                            .map((c) => `${c[0]},${c[1]}`)
                                            .join(" ")}
                                    </gml:coordinates>
                                </gml:LinearRing>
                            </gml:outerBoundaryIs>
                        </gml:Polygon>
                    </gml:polygonMember>
                    `
                    )
                    .join("")}
                </gml:MultiPolygon>`
    }
}

export const featureToWFSTInsert = ({ geoserverWorkspace, resource, data }) => {
    const wfsProperties = Object.keys(data.properties).map((property) => {
        const propertyValue = data.properties[property]
        return `<${geoserverWorkspace}:${property}>${propertyValue}</${geoserverWorkspace}:${property}>`
    })
    const geometryFieldName = "the_geom" //TODO: get geometry field name from schema
    const wfsGeometry = `
        <feature:${geometryFieldName}>
            ${getGMLGeometry(data.geometry)}
        </feature:${geometryFieldName}>
    `
    const xmlWFST = `
    <wfs:Transaction service="WFS" version="1.0.0"
        xmlns:gml="http://www.opengis.net/gml"
        xmlns:ogc="http://www.opengis.net/ogc"
        xmlns:wfs="http://www.opengis.net/wfs"
        xmlns:${geoserverWorkspace}="${geoserverWorkspace}">
        <wfs:Insert>
            <${geoserverWorkspace}:${resource} xmlns:feature="http://www.openplans.org/${resource}">
            ${wfsProperties.join("")}
            ${wfsGeometry}
            </${geoserverWorkspace}:${resource}>
        </wfs:Insert>
    </wfs:Transaction>`
    return xmlWFST
}

export const featureToWFSTUpdate = ({
    geoserverWorkspace,
    resource,
    id,
    data,
}) => {
    const wfsProperties = Object.keys(data.properties).map((property) => {
        const propertyValue = data.properties[property]
        return `
        <wfs:Property>
        <wfs:Name>${property}</wfs:Name>
        <wfs:Value>${propertyValue}</wfs:Value>
        </wfs:Property>
        `
    })
    const geometryFieldName = "the_geom" //TODO: get geometry field name from schema
    const wfsGeometry = `
        <wfs:Property>
            <wfs:Name>${geometryFieldName}</wfs:Name>
            <wfs:Value>
                ${getGMLGeometry(data.geometry)}
            </wfs:Value>
        </wfs:Property>
    `
    const xmlWFST = `
    <wfs:Transaction service="WFS" version="1.0.0"
        xmlns:gml="http://www.opengis.net/gml"
        xmlns:ogc="http://www.opengis.net/ogc"
        xmlns:wfs="http://www.opengis.net/wfs">
        <wfs:Update typeName="${geoserverWorkspace}:${resource}">
        ${wfsProperties.join("")}
        ${wfsGeometry}
        <ogc:Filter>
            <ogc:FeatureId fid="${id}"/>
        </ogc:Filter>
        </wfs:Update>
    </wfs:Transaction>`
    return xmlWFST
}

export const featureToWFSTDelete = ({ geoserverWorkspace, resource, ids }) => {
    const featureIds = ids.map(id => `<ogc:FeatureId fid="${id}"/>`).join("");

    const xmlWFST = `
    <wfs:Transaction service="WFS" version="1.0.0"
        xmlns:ogc="http://www.opengis.net/ogc"
        xmlns:wfs="http://www.opengis.net/wfs">
        <wfs:Delete typeName="${geoserverWorkspace}:${resource}">
            <ogc:Filter>
                ${featureIds}
            </ogc:Filter>
        </wfs:Delete>
    </wfs:Transaction>`
    return xmlWFST
}

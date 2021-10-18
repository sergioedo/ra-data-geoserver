import { fetchUtils } from "react-admin"
import { stringify } from "query-string"

const buildHTTPHeaders = (options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: "application/json" })
    }
    // GeoServer Security
    if (options.geoserverUser) {
        const credentials = `${options.geoserverUser}:${options.geoserverPassword}`
        const encodedCredentials = btoa(
            unescape(encodeURIComponent(credentials))
        )
        options.headers.set("Authorization", `Basic ${encodedCredentials}`)
    }
    return options
}

const httpClient = (url, options = {}) => {
    return fetchUtils.fetchJson(url, buildHTTPHeaders(options))
}

const httpClientWFST = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: "application/json" })
    }
    // Force content type to XML
    options.headers.set("Content-Type", "text/xml")
    return fetchUtils.fetchJson(url, buildHTTPHeaders(options))
}

/**
 *
 * @param {string} geoserverBaseURL GeoServer Base URL
 * @param {string} geoserverWorkspace GeoServer Workspace, to avoid prefix all layer names (resources)
 * @param {object} extraQueryParams Object with extra query parameters (filters)
 * @param {boolean} flattenProperties Transform GeoJSON to plain JSON object
 */
export default function ({
    geoserverBaseURL,
    geoserverWorkspace,
    extraQueryParams,
    flattenProperties,
    geoserverUser,
    geoserverPassword,
}) {
    const featureToData = (feature) => {
        if (flattenProperties) {
            return {
                id: feature.id,
                ...feature.properties,
                //TODO: geometry, as lat-lon fields (centroid on lines, polygons...)
                // lon: feature.geometry.coordinates[0],
                // lat: feature.geometry.coordinates[1]
            }
        } else {
            return feature
        }
    }

    const getTypeName = (resource) => {
        if (geoserverWorkspace && geoserverWorkspace !== "") {
            return `${geoserverWorkspace}:${resource}`
        } else {
            return resource
        }
    }

    const getList = (resource, params) => {
        const { page, perPage } = params.pagination
        const { field, order } = params.sort
        const query = {
            ...extraQueryParams,
            startIndex: (page - 1) * perPage,
            count: perPage,
            //TODO: cql_filter: JSON.stringify(params.filter)
        }
        const sortBy =
            field !== "id" ? `${field}+${order === "ASC" ? "A" : "D"}` : "" //Disable sort by id, not supported by GeoServer, only properties
        const url = `${geoserverBaseURL}/wfs?request=getFeature&typeName=${getTypeName(
            resource
        )}&outputFormat=json&${stringify(
            query
        )}&sortBy=${sortBy}&srsName=EPSG:4326`

        return httpClient(url).then(({ json }) => ({
            data: json.features.map((f) => featureToData(f)),
            total: json.totalFeatures,
        }))
    }

    const getOne = (resource, params) => {
        const query = {
            featureID: params.id,
        }
        const url = `${geoserverBaseURL}/wfs?request=getFeature&typeName=${getTypeName(
            resource
        )}&outputFormat=json&${stringify(query)}&srsName=EPSG:4326`

        return httpClient(url).then(({ json }) => ({
            data: featureToData(json.features[0]),
        }))
    }

    // TODO: pending implementation
    const getMany = (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        }
        const url = `${apiUrl}/${resource}?${stringify(query)}`
        return httpClient(url).then(({ json }) => ({ data: json }))
    }

    // TODO: pending implementation
    const getManyReference = (resource, params) => {
        const { page, perPage } = params.pagination
        const { field, order } = params.sort
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify({
                ...params.filter,
                [params.target]: params.id,
            }),
        }
        const url = `${apiUrl}/${resource}?${stringify(query)}`

        return httpClient(url).then(({ headers, json }) => ({
            data: json,
            total: parseInt(headers.get("content-range").split("/").pop(), 10),
        }))
    }

    const featureToWFSTUpdate = ({ resource, id, data }) => {
        const wfsProperties = Object.keys(data.properties).map((property) => {
            const propertyValue = data.properties[property]
            return `
            <wfs:Property>
            <wfs:Name>${property}</wfs:Name>
            <wfs:Value>${propertyValue}</wfs:Value>
            </wfs:Property>
            `
        })
        const xmlWFST = `
        <wfs:Transaction service="WFS" version="1.0.0"
            xmlns:ogc="http://www.opengis.net/ogc"
            xmlns:wfs="http://www.opengis.net/wfs">
            <wfs:Update typeName="${geoserverWorkspace}:${resource}">
            ${wfsProperties.join("")}
            <ogc:Filter>
                <ogc:FeatureId fid="${id}"/>
            </ogc:Filter>
            </wfs:Update>
        </wfs:Transaction>`
        return xmlWFST
    }

    const update = (resource, params) => {
        const url = `${geoserverBaseURL}/wfs`
        return httpClientWFST(url, {
            method: "POST",
            body: featureToWFSTUpdate({
                resource,
                id: params.id,
                data: params.data,
            }),
            geoserverUser,
            geoserverPassword,
        }).then(({ xmlText }) => {
            return { data: params.data }
        })
    }
    // TODO: pending implementation
    const updateMany = (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        }
        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: "PUT",
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }))
    }

    // TODO: pending implementation
    const create = (resource, params) =>
        httpClient(`${apiUrl}/${resource}`, {
            method: "POST",
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({
            data: { ...params.data, id: json.id },
        }))

    const featureToWFSTDelete = ({ resource, id }) => {
        const xmlWFST = `
            <wfs:Transaction service="WFS" version="1.0.0"
                xmlns:ogc="http://www.opengis.net/ogc"
                xmlns:wfs="http://www.opengis.net/wfs">
                <wfs:Delete typeName="${geoserverWorkspace}:${resource}">
                    <ogc:Filter>
                        <ogc:FeatureId fid="${id}"/>
                    </ogc:Filter>
                </wfs:Delete>
            </wfs:Transaction>`
        return xmlWFST
    }

    const del = (resource, params) => {
        const url = `${geoserverBaseURL}/wfs`
        return httpClientWFST(url, {
            method: "POST",
            body: featureToWFSTDelete({ resource, id: params.id }),
            geoserverUser,
            geoserverPassword,
        }).then(({ xmlText }) => {
            return { data: params.previousData }
        })
    }

    // TODO: pending implementation
    const deleteMany = (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        }
        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: "DELETE",
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }))
    }

    return {
        getList,
        getOne,
        getMany,
        getManyReference,
        update,
        updateMany,
        create,
        delete: del,
        deleteMany,
    }
}

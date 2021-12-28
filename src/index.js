import { fetchUtils } from "react-admin"
import { stringify } from "query-string"
import {
    featureToWFSTInsert,
    featureToWFSTUpdate,
    featureToWFSTDelete,
} from "./utils"

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
 */
export default function ({
    geoserverBaseURL,
    geoserverWorkspace,
    extraQueryParams,
    geoserverUser,
    geoserverPassword,
}) {
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
            field !== "id"
                ? `${field.replace("properties.", "")}+${order === "ASC" ? "A" : "D"
                }`
                : "" //Disable sort by id, not supported by GeoServer, only properties
        const url = `${geoserverBaseURL}/wfs?request=getFeature&typeName=${getTypeName(
            resource
        )}&outputFormat=json&${stringify(
            query
        )}&sortBy=${sortBy}&srsName=EPSG:4326`

        return httpClient(url).then(({ json }) => ({
            data: json.features,
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
            data: json.features[0],
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

    const update = (resource, params) => {
        const url = `${geoserverBaseURL}/wfs`
        return httpClientWFST(url, {
            method: "POST",
            body: featureToWFSTUpdate({
                geoserverWorkspace,
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

    const create = (resource, params) => {
        const url = `${geoserverBaseURL}/wfs`
        return httpClientWFST(url, {
            method: "POST",
            body: featureToWFSTInsert({
                geoserverWorkspace,
                resource,
                data: params.data,
            }),
            geoserverUser,
            geoserverPassword,
        }).then((data) => {
            const xmlParser = new DOMParser()
            const xmlDoc = xmlParser.parseFromString(data.body, "text/xml")
            const id = xmlDoc
                .getElementsByTagName("ogc:FeatureId")[0]
                .getAttribute("fid")
            return { data: { ...params.data, id } }
        })
    }

    const del = (resource, params) => {
        const url = `${geoserverBaseURL}/wfs`
        return httpClientWFST(url, {
            method: "POST",
            body: featureToWFSTDelete({
                geoserverWorkspace,
                resource,
                id: params.id,
            }),
            geoserverUser,
            geoserverPassword,
        }).then(({ xmlText }) => {
            return { data: { id: params.id } }
        })
    }

    const deleteMany = (resource, params) => {
        return Promise.all(
            params.ids.map((id) =>
                del(resource, { id, previousData: params.data })
            )
        ).then((responses) => ({
            data: responses.map((data) => data.id),
        }))
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

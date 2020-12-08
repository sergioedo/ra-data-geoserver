import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';

const httpClient = fetchUtils.fetchJson;

/**
 * 
 * @param {string} geoserverBaseURL GeoServer Base URL 
 * @param {string} geoserverWorkspace GeoServer Workspace, to avoid prefix all layer names (resources)
 * @param {object} extraQueryParams Object with extra query parameters (filters)
 * @param {boolean} flattenProperties Transform GeoJSON to plain JSON object
 */
export default function (geoserverBaseURL, geoserverWorkspace, extraQueryParams, flattenProperties) {

    const featureToData = (feature) => {
        if (flattenProperties) {
            return {
                id: feature.id,
                ...(feature.properties)
                //TODO: geometry, as lat-lon fields
            }
        } else {
            return feature
        }
    }

    const getTypeName = (resource) => {
        if (geoserverWorkspace && geoserverWorkspace !== '') {
            return `${geoserverWorkspace}:${resource}`;
        } else {
            return resource;
        }
    }

    const getList = (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            ...extraQueryParams,
            startIndex: (page - 1) * perPage,
            count: perPage,
            //TODO: cql_filter: JSON.stringify(params.filter)
        };
        const sortBy = (field !== 'id') ? `${field}+${order === 'ASC' ? 'A' : 'D'}` : '' //Disable sort by id, not supported by GeoServer, only properties
        const url = `${geoserverBaseURL}/wfs?request=getFeature&typeName=${getTypeName(resource)}&outputFormat=json&${stringify(query)}&sortBy=${sortBy}`;

        return httpClient(url).then(({ json }) => ({
            data: json.features.map(f => featureToData(f)),
            total: json.totalFeatures
        }));
    }

    const getOne = (resource, params) => {
        const query = {
            featureID: params.id
        }
        const url = `${geoserverBaseURL}/wfs?request=getFeature&typeName=${getTypeName(resource)}&outputFormat=json&${stringify(query)}`;

        return httpClient(url).then(({ json }) => ({
            data: featureToData(json.features[0])
        }));
    }

    // TODO: pending implementation
    const getMany = (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        return httpClient(url).then(({ json }) => ({ data: json }));
    }

    // TODO: pending implementation
    const getManyReference = (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify({
                ...params.filter,
                [params.target]: params.id,
            }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;

        return httpClient(url).then(({ headers, json }) => ({
            data: json,
            total: parseInt(headers.get('content-range').split('/').pop(), 10),
        }));
    }

    // TODO: pending implementation
    const update = (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }))

    // TODO: pending implementation
    const updateMany = (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }));
    }

    // TODO: pending implementation
    const create = (resource, params) =>
        httpClient(`${apiUrl}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({
            data: { ...params.data, id: json.id },
        }))

    // TODO: pending implementation
    const del = (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: json }))

    // TODO: pending implementation
    const deleteMany = (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'DELETE',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }));
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
        deleteMany
    }
};

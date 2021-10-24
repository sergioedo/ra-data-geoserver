import * as React from "react"
import {
    List,
    Create,
    Edit,
    Show,
    Datagrid,
    SimpleForm,
    TextField,
    NumberField,
    TextInput,
    SimpleShowLayout,
    useShowController,
} from "react-admin"
import {
    MapContainer,
    TileLayer,
    Marker,
    // Popup,
    FeatureGroup,
} from "react-leaflet"
import { EditControl } from "react-leaflet-draw"

export const PoiList = (props) => (
    <List {...props}>
        <Datagrid rowClick="show">
            <TextField source="id" label={"ID"} />
            <TextField source="properties.NAME" label={"Name"} />
            <TextField source="properties.THUMBNAIL" label={"Thumbnail"} />
            <TextField source="properties.MAINPAGE" label={"Main Page"} />
        </Datagrid>
    </List>
)

export const PoiCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="properties.NAME" label={"Name"} />
            <TextInput source="properties.THUMBNAIL" label={"Thumbnail"} />
            <TextInput source="properties.MAINPAGE" label={"Main Page"} />
            <TextInput
                source="geometry.coordinates[1]"
                label={"Latitude"}
                defaultValue={"41.390205"}
            />
            <TextInput
                source="geometry.coordinates[0]"
                label={"Longitude"}
                defaultValue={"2.154007"}
            />
        </SimpleForm>
    </Create>
)

export const PoiEdit = (props) => {
    const { record } = useShowController(props)
    const lat = record && record.geometry.coordinates[1]
    const lon = record && record.geometry.coordinates[0]

    const handleEditedGeometry = ({ layers }) => {
        const layer = layers.getLayers()[0] // get unique layer
        console.log(layer.getLatLng())
    }

    return (
        <Edit {...props}>
            <SimpleForm>
                {/* <TextInput source="id" label={'ID'} /> */}
                <TextInput source="properties.NAME" label={"Name"} />
                <TextInput source="properties.THUMBNAIL" label={"Thumbnail"} />
                <TextInput source="properties.MAINPAGE" label={"Main Page"} />
                <TextInput
                    source="geometry.coordinates[1]"
                    label={"Latitude"}
                />
                <TextInput
                    source="geometry.coordinates[0]"
                    label={"Longitude"}
                />
                {record && (
                    <MapContainer
                        style={{ height: "350px" }}
                        center={[lat, lon]}
                        zoom={16}
                        scrollWheelZoom={true}
                    >
                        <FeatureGroup>
                            <EditControl
                                position="topright"
                                onEdited={handleEditedGeometry}
                                draw={{
                                    circle: false,
                                    circlemarker: false,
                                    marker: false,
                                    polygon: false,
                                    polyline: false,
                                    rectangle: false,
                                }}
                            />
                            <Marker position={[lat, lon]} />
                        </FeatureGroup>
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </MapContainer>
                )}
            </SimpleForm>
        </Edit>
    )
}

export const PoiShow = (props) => {
    const {
        // basePath, // deduced from the location, useful for action buttons
        // defaultTitle, // the translated title based on the resource, e.g. 'Post #123'
        // loaded, // boolean that is false until the record is available
        // loading, // boolean that is true on mount, and false once the record was fetched
        record, // record fetched via dataProvider.getOne() based on the id from the location
        // resource, // the resource name, deduced from the location. e.g. 'posts'
        // version, // integer used by the refresh feature
    } = useShowController(props)
    const lat = record && record.geometry.coordinates[1]
    const lon = record && record.geometry.coordinates[0]
    return (
        <Show {...props}>
            <SimpleShowLayout>
                {/* <TextField source="id" /> */}
                <TextField source="properties.NAME" label={"Name"} />
                <TextField source="properties.THUMBNAIL" label={"Thumbnail"} />
                <TextField source="properties.MAINPAGE" label={"Main Page"} />
                <TextField source="geometry.type" label={"Geometry"} />
                <NumberField
                    source="geometry.coordinates[1]"
                    label={"Latitude"}
                    options={{
                        style: "decimal",
                        maximumFractionDigits: 6,
                    }}
                />
                <NumberField
                    source="geometry.coordinates[0]"
                    label={"Longitude"}
                    options={{
                        style: "decimal",
                        maximumFractionDigits: 6,
                    }}
                />
                {record && (
                    <MapContainer
                        style={{ height: "350px" }}
                        center={[lat, lon]}
                        zoom={16}
                        scrollWheelZoom={true}
                    >
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[lat, lon]}>
                            {/* <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup> */}
                        </Marker>
                    </MapContainer>
                )}
            </SimpleShowLayout>
        </Show>
    )
}

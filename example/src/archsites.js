import * as React from "react"
import {
    List,
    Edit,
    Show,
    Datagrid,
    SimpleForm,
    TextField,
    NumberField,
    TextInput,
    NumberInput,
    SimpleShowLayout,
    useShowController,
} from "react-admin"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"

export const ArchSiteList = (props) => (
    <List {...props}>
        <Datagrid rowClick="show">
            <TextField source="id" label={"ID"} />
            <TextField source="properties.str1" label={"Name"} />
            <NumberField source="properties.cat" label={"Category"} />
        </Datagrid>
    </List>
)

export const ArchSiteEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            {/* <TextInput source="id" label={'ID'} /> */}
            <TextInput source="properties.str1" label={"Name"} />
            <NumberInput source="properties.cat" label={"Category"} />
            <TextInput source="geometry.coordinates[1]" label={"Latitude"} />
            <TextInput source="geometry.coordinates[0]" label={"Longitude"} />
        </SimpleForm>
    </Edit>
)

export const ArchSiteShow = (props) => {
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
                <NumberField source="properties.str1" label={"Name"} />
                <NumberField source="properties.cat" label={"Category"} />
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
                        zoom={12}
                        scrollWheelZoom={true}
                    >
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[lat, lon]}>
                            <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup>
                        </Marker>
                    </MapContainer>
                )}
            </SimpleShowLayout>
        </Show>
    )
}

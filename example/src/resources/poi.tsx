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
} from "react-admin"
import GeometryInput from "../components/GeometryInput"
import GeometryField from "../components/GeometryField"

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
            <GeometryInput source="geometry" geometryType={"Point"} />
        </SimpleForm>
    </Create>
)

export const PoiEdit = (props) => {
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
                <GeometryInput source="geometry" />
            </SimpleForm>
        </Edit>
    )
}

export const PoiShow = (props) => {
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
                <GeometryField source="geometry" />
            </SimpleShowLayout>
        </Show>
    )
}

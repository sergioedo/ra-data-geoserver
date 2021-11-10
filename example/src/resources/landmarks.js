import * as React from "react"
import {
    List,
    Create,
    Edit,
    Show,
    Datagrid,
    SimpleForm,
    TextField,
    TextInput,
    SimpleShowLayout,
} from "react-admin"
import GeometryInput from "../components/GeometryInput"
import GeometryField from "../components/GeometryField"

export const LandMarkList = (props) => (
    <List {...props}>
        <Datagrid rowClick="show">
            <TextField source="id" label={"ID"} />
            <TextField source="properties.LAND" label={"Code"} />
            <TextField source="properties.CFCC" label={"CFCC"} />
            <TextField source="properties.LANAME" label={"Name"} />
        </Datagrid>
    </List>
)

export const LandMarkCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="properties.LAND" label={"Code"} />
            <TextInput source="properties.CFCC" label={"CFCC"} />
            <TextInput source="properties.LANAME" label={"Name"} />
            <GeometryInput source="geometry" geometryType={"MultiPolygon"} />
        </SimpleForm>
    </Create>
)

export const LandMarkEdit = (props) => {
    return (
        <Edit {...props}>
            <SimpleForm>
                <TextInput source="properties.LAND" label={"Code"} />
                <TextInput source="properties.CFCC" label={"CFCC"} />
                <TextInput source="properties.LANAME" label={"Name"} />
                <GeometryInput source="geometry" />
            </SimpleForm>
        </Edit>
    )
}

export const LandMarkShow = (props) => {
    return (
        <Show {...props}>
            <SimpleShowLayout>
                <TextField source="properties.LAND" label={"Code"} />
                <TextField source="properties.CFCC" label={"CFCC"} />
                <TextField source="properties.LANAME" label={"Name"} />
                <GeometryField source="geometry" />
            </SimpleShowLayout>
        </Show>
    )
}

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

export const RoadList = (props) => (
    <List {...props}>
        <Datagrid rowClick="show">
            <TextField source="id" label={"ID"} />
            <TextField source="properties.NAME" label={"Name"} />
            <TextField source="properties.CFCC" label={"CFCC"} />
        </Datagrid>
    </List>
)

export const RoadCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="properties.NAME" label={"Name"} />
            <TextInput source="properties.CFCC" label={"CFCC"} />
            <GeometryInput source="geometry" geometryType={"MultiLineString"} />
        </SimpleForm>
    </Create>
)

export const RoadEdit = (props) => {
    return (
        <Edit {...props}>
            <SimpleForm>
                <TextInput source="properties.NAME" label={"Name"} />
                <TextInput source="properties.CFCC" label={"CFCC"} />
                <GeometryInput source="geometry" />
            </SimpleForm>
        </Edit>
    )
}

export const RoadShow = (props) => {
    return (
        <Show {...props}>
            <SimpleShowLayout>
                <TextField source="properties.NAME" label={"Name"} />
                <TextField source="properties.CFCC" label={"CFCC"} />
                <GeometryField source="geometry" />
            </SimpleShowLayout>
        </Show>
    )
}

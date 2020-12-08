import * as React from "react";
import { List, Edit, Datagrid, SimpleForm, TextField, NumberField, TextInput, NumberInput } from 'react-admin';

export const ArchSiteList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" label={'ID'} />
            <TextField source="properties.str1" label={'Name'} />
            <NumberField source="properties.cat" label={'Category'} />
        </Datagrid>
    </List>
);

export const ArchSiteEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            {/* <TextInput source="id" label={'ID'} /> */}
            <TextInput source="properties.str1" label={'Name'} />
            <NumberInput source="properties.cat" label={'Category'} />
        </SimpleForm>
    </Edit>
);
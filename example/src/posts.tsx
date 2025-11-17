import {
    List,
    DataTable,
    ReferenceField,
    EditButton,
    Edit,
	Create,
    SimpleForm,
    ReferenceInput,
    TextInput
} from "react-admin";

const postFilters = [
    <TextInput source="q" label="Search" alwaysOn />,
    <ReferenceInput source="userId" label="User" reference="users" />,
];

export const PostList = () => (
    <List filters={postFilters}>
        <DataTable rowClick={false}>
			<DataTable.Col source="id" />
            <DataTable.Col source="userId">
                <ReferenceField source="userId" reference="users" link="show" />
            </DataTable.Col>
            <DataTable.Col source="title" />
			<DataTable.Col>
				<EditButton />
			</DataTable.Col>
        </DataTable>
    </List>
);

export const PostEdit = () => (
    <Edit>
        <SimpleForm>
			<TextInput source="id" InputProps={{ disabled: true }} />
            <ReferenceInput source="userId" reference="users" />
            <TextInput source="title" />
            <TextInput source="body" multiline rows={5} />
        </SimpleForm>
    </Edit>
);

export const PostCreate = () => (
	<Create>
		<SimpleForm>
			<ReferenceInput source="userId" reference="users" />
			<TextInput source="title" />
			<TextInput source="body" multiline rows={5} />
		</SimpleForm>
	</Create>
);
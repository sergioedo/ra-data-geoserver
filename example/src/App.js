import * as React from "react";
import { Admin, Resource } from 'react-admin';
import geoServerProvider from 'ra-data-geoserver';
import { ArchSiteList, ArchSiteEdit } from './archsites'
import RoomIcon from '@material-ui/icons/Room';

const baseURL = 'http://localhost:8080/geoserver';
const extraParams = {
  // cql_filter: 'cat<=15',
}
const dataProvider = geoServerProvider(baseURL, extraParams);
const App = () => (
  <Admin title="GeoServer Admin" dataProvider={dataProvider}>
    <Resource name="sf:archsites" icon={RoomIcon} options={{ label: 'Archeological Sites' }} list={ArchSiteList} edit={ArchSiteEdit} />
  </Admin>
);

export default App;
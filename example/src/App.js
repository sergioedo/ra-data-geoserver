import * as React from "react"
import { Admin, Resource } from "react-admin"
import geoServerProvider from "ra-data-geoserver"
// import { ArchSiteList, ArchSiteEdit, ArchSiteShow } from "./archsites"
import { PoiList, PoiCreate, PoiEdit, PoiShow } from "./poi"
import RoomIcon from "@material-ui/icons/Room"

const dataProvider = geoServerProvider({
    geoserverBaseURL: "http://localhost:3000/geoserver",
    geoserverWorkspace: "tiger",
    // extraQueryParams: {
    //     cql_filter: "cat<=15",
    // },
    // flattenProperties: false,
    geoserverUser: process.env.REACT_APP_GEOSERVER_USER,
    geoserverPassword: process.env.REACT_APP_GEOSERVER_PASSWORD,
})
const App = () => (
    <Admin title="GeoServer Admin" dataProvider={dataProvider}>
        <Resource
            name="poi"
            icon={RoomIcon}
            options={{ label: "Manhattan POIs" }}
            list={PoiList}
            show={PoiShow}
            create={PoiCreate}
            edit={PoiEdit}
        />
    </Admin>
)

export default App

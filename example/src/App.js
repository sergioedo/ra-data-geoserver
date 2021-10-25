import * as React from "react"
import { Admin, Resource } from "react-admin"
import geoServerProvider from "ra-data-geoserver"
// import { ArchSiteList, ArchSiteEdit, ArchSiteShow } from "./archsites"
import { PoiList, PoiCreate, PoiEdit, PoiShow } from "./poi"
import { RoadList, RoadCreate, RoadEdit, RoadShow } from "./roads"
import POIIcon from "@material-ui/icons/Room"
import LineIcon from "@material-ui/icons/Timeline"
// import PolygonIcon from "@material-ui/icons/FormatShapes"

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
            icon={POIIcon}
            options={{ label: "Manhattan POIs" }}
            list={PoiList}
            show={PoiShow}
            create={PoiCreate}
            edit={PoiEdit}
        />
        <Resource
            name="tiger_roads"
            icon={LineIcon}
            options={{ label: "Manhattan Roads" }}
            list={RoadList}
            show={RoadShow}
            create={RoadCreate}
            edit={RoadEdit}
        />
    </Admin>
)

export default App

import * as React from "react"
import { Admin, Resource } from "react-admin"
import geoServerProvider from "ra-data-geoserver"
import { PoiList, PoiCreate, PoiEdit, PoiShow } from "./resources/poi"
import { RoadList, RoadCreate, RoadEdit, RoadShow } from "./resources/roads"
import {
    LandMarkList,
    LandMarkCreate,
    LandMarkEdit,
    LandMarkShow,
} from "./resources/landmarks"
import POIIcon from "@material-ui/icons/Room"
import LineIcon from "@material-ui/icons/Timeline"
import PolygonIcon from "@material-ui/icons/FormatShapes"

const dataProvider = geoServerProvider({
    geoserverBaseURL: "http://localhost:3000/geoserver",
    geoserverWorkspace: "tiger",
    // extraQueryParams: {
    //     cql_filter: "cat<=15",
    // },
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
        <Resource
            name="poly_landmarks"
            icon={PolygonIcon}
            options={{ label: "Manhattan LandMarks" }}
            list={LandMarkList}
            show={LandMarkShow}
            create={LandMarkCreate}
            edit={LandMarkEdit}
        />
    </Admin>
)

export default App

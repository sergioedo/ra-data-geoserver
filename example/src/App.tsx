import { Admin, Resource, ShowGuesser } from "react-admin";
// import { dataProvider } from './dataProvider';
import geoServerProvider from "ra-data-geoserver";
// import { PostList, PostEdit, PostCreate } from "./posts";
import { PoiList/*, PoiCreate*/, PoiEdit, PoiShow } from "./resources/poi"
import { RoadList/*, RoadCreate, RoadEdit*/, RoadShow } from "./resources/roads"
import {
    LandMarkList,
    // LandMarkCreate,
    // LandMarkEdit,
    LandMarkShow
} from "./resources/landmarks"
// import { UserList } from "./users";
import { Dashboard } from './Dashboard';
import { authProvider } from './authProvider';

import POIIcon from "@material-ui/icons/Room"
import LineIcon from "@material-ui/icons/Timeline"
import PolygonIcon from "@material-ui/icons/FormatShapes"
import PostIcon from "@mui/icons-material/Book";
import UserIcon from "@mui/icons-material/Group";

const dataProvider = geoServerProvider({
    geoserverBaseURL: "http://localhost:5173/geoserver",
    geoserverWorkspace: "tiger",
    // extraQueryParams: {
    //     cql_filter: "cat<=15",
    // },
    geoserverUser: import.meta.env.VITE_GEOSERVER_USER,
    geoserverPassword: import.meta.env.VITE_GEOSERVER_PASSWORD,
})

export const App = () => (
    <Admin authProvider={authProvider} dataProvider={dataProvider} dashboard={Dashboard} >
        <Resource
            name="poi"
            icon={POIIcon}
            options={{ label: "Manhattan POIs" }}
            list={PoiList}
            show={PoiShow}
            // create={PoiCreate}
            edit={PoiEdit}
        />
        <Resource
            name="tiger_roads"
            icon={LineIcon}
            options={{ label: "Manhattan Roads" }}
            list={RoadList}
            show={RoadShow}
        // create={RoadCreate}
        // edit={RoadEdit}
        />
        <Resource
            name="poly_landmarks"
            icon={PolygonIcon}
            options={{ label: "Manhattan LandMarks" }}
            list={LandMarkList}
            show={LandMarkShow}
        // create={LandMarkCreate}
        // edit={LandMarkEdit}
        />
    </Admin>
);
import { combineReducers } from "redux";




// Authentication
import Login from "./auth/login/reducer";
import Account from "./auth/register/reducer";
import ForgetPassword from "./auth/forgetpwd/reducer";
import Profile from "./auth/profile/reducer";
import Users from "./users/reducer";
import Groups from "./groups/reducer";


// Elections
import Elections from "./elections/reducer";
import Candidates from "./candidates/reducer";
import Campaigns from "./campaigns/reducer";
// import ElectionCandidates from "./electionCandidate/reducer";

// Electors
import Electors from "./electors/reducer";
// import Guarantees from "./guarantees/reducer";
// import Attendees from "./attendees/reducer";

// System
import UploadImage from "./uploadImage/reducer";


// Front
import Layout from "./layouts/reducer";


// Settings
import Categories from "./categories/reducer";

//API Key
const rootReducer = combineReducers({

    // Theme
    Layout,
    Login,
    Account,
    ForgetPassword,
    Profile,
    Users,
    Groups,

    // Project
    Elections,
    Candidates,
    Campaigns,
    Electors,
    // Guarantees,
    // Attendees,
    
    // System / Settings
    UploadImage,
    Categories,

});

export default rootReducer;
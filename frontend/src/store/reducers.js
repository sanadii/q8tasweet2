import { combineReducers } from "redux";




// Authentication
import Login from "./auth/login/reducer";
import Account from "./auth/register/reducer";
import ForgetPassword from "./auth/forgetpwd/reducer";
import Profile from "./auth/profile/reducer";
import Users from "./auth/users/reducer";
import Groups from "./groups/reducer";
import GroupPermissions from "./groupPermissions/reducer";
<<<<<<< HEAD
=======
import ResetPassword from "./auth/resetpassword/reducer";
>>>>>>> sanad


// Elections
import Elections from "./elections/reducer";
<<<<<<< HEAD
=======
import ElectionSchema from "./electionSchema/reducer";
import Electors from "./electors/reducer";


>>>>>>> sanad
import Candidates from "./candidates/reducer";
import Parties from "./parties/reducer";
import Campaigns from "./campaigns/reducer";
// import ElectionCandidates from "./electionCandidate/reducer";

<<<<<<< HEAD
// Electors
import Electors from "./electors/reducer";
=======
// Voters
// import Voters from "./voters/reducer";
>>>>>>> sanad
// import Guarantees from "./guarantees/reducer";
// import Attendees from "./attendees/reducer";

// System
import UploadImage from "./uploadImage/reducer";


// Front
import Layout from "./layouts/reducer";


// Settings
import Categories from "./categories/reducer";
import Notifications from "./notifications/reducer";

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
    GroupPermissions,
<<<<<<< HEAD
    
    // Project
    Elections,
    Candidates,
    Parties,
    Campaigns,
    Electors,
    // Guarantees,
    // Attendees,
    
=======
    ResetPassword,

    // Project
    Elections,

    // Schema & Related Apps
    ElectionSchema,
    Electors,
    Candidates,
    Parties,
    Campaigns,
    // Guarantees,
    // Attendees,

>>>>>>> sanad
    // System / Settings
    UploadImage,
    Categories,

});

export default rootReducer;
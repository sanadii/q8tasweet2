import { all, fork } from "redux-saga/effects";

// Authentication
import AccountSaga from "./auth/register/saga";
import AuthSaga from "./auth/login/saga";
import ForgetSaga from "./auth/forgetpwd/saga";
import ProfileSaga from "./auth/profile/saga";
import UsersSaga from "./auth/users/saga";
import GroupsSaga from "./groups/saga";
import groupPermissionSaga from "./groupPermissions/saga";
<<<<<<< HEAD

=======
import ResetPasswordSaga from "./auth/resetpassword/saga";
>>>>>>> sanad

// Elections
import electionSaga from "./elections/saga";
import candidatesSaga from "./candidates/saga";
import partiesSaga from "./parties/saga";
import campaignsSaga from "./campaigns/saga";
<<<<<<< HEAD
=======

// Schema & Related Apps
import electionSchemaSaga from "./electionSchema/saga";
>>>>>>> sanad
import electorSaga from "./electors/saga";

// System
import UploadImageSaga from "./uploadImage/saga";
import NotificationSaga from "./notifications/saga";

// Settings
import LayoutSaga from "./layouts/saga";
import Categories from "./categories/saga";


<<<<<<< HEAD
=======

>>>>>>> sanad
export default function* rootSaga() {
  yield all([
    // Authentication
    fork(AccountSaga),
    fork(AuthSaga),
    fork(ForgetSaga),
    fork(ProfileSaga),
    fork(UsersSaga),
    fork(GroupsSaga),
    fork(groupPermissionSaga),
<<<<<<< HEAD

    // Project
    fork(electionSaga),
    fork(candidatesSaga),
    fork(partiesSaga),
    fork(campaignsSaga),
    fork(electorSaga),
=======
    fork(ResetPasswordSaga),

    // Project
    fork(electionSaga),
    fork(electionSchemaSaga),
    fork(electorSaga),
    fork(candidatesSaga),
    fork(partiesSaga),
    fork(campaignsSaga),
>>>>>>> sanad
    // fork(guaranteeSaga),
    // fork(attendeeSaga),

    // System / Settings
    fork(LayoutSaga),
    fork(UploadImageSaga),
    fork(Categories),
    fork(NotificationSaga),

  ]);
}

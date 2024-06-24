import { takeEvery, fork, put, all, call } from "redux-saga/effects";

// Login Redux States
import { RESET_PASSWORD } from "./actionTypes";
import { userResetPasswordSuccess, userResetPasswordError } from "./actions";

//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import { postFakeForgetPwd, postResetPassword, } from "../../../helpers/backend_helper";

const fireBaseBackend = getFirebaseBackend();

//If user is send successfully send mail link then dispatch redux action's are directly from here.
function* resetPassword({ payload: { user, history } }) {
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(fireBaseBackend.forgetPassword, user.email);
      if (response) {
        yield put(userResetPasswordSuccess("Password reset successfully!"));
      }
    } else {
      const response = yield call(postResetPassword, { token: user.token, password: user.password, cpassword: user.confirmPassword });
      if (response?.success) {
        yield put(userResetPasswordSuccess("Password reset successfully!"));
      } else {
        yield put(userResetPasswordError(response?.msg || "Password reset failed!"));
      }
    }
  } catch (error) {
    yield put(userResetPasswordError(error?.msg || 'Password reset failed!'));
  }
}

export function* watchUserPasswordForget() {
  yield takeEvery(RESET_PASSWORD, resetPassword);
}

function* forgetPasswordSaga() {
  yield all([fork(watchUserPasswordForget)]);
}

export default forgetPasswordSaga;

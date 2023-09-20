import { call, put, takeEvery, all, fork, take } from "redux-saga/effects";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Invoice Redux States
import {
  GET_CATEGORIES,
  ADD_NEW_CATEGORY,
  DELETE_CATEGORY,
  UPDATE_CATEGORY,
} from "./actionType";


// Maybe to remove
import {
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_IMAGE_FAIL,
} from "../uploadImage/actionType";


import {
  categoriesApiResponseSuccess,
  categoriesApiResponseError,
  addCategorySuccess,
  addCategoryFail,
  updateCategorySuccess,
  updateCategoryFail,
  deleteCategorySuccess,
  deleteCategoryFail
} from "./action";

import { uploadNewImage } from "../uploadImage/action";


//Include Both Helper Category with needed methods
import {
  getCategories as getCategoriesApi,
  addNewCategory,
  updateCategory,
  deleteCategory,
} from "../../helpers/backend_helper";


function* getCategories() {
  try {
    const response = yield call(getCategoriesApi);
    yield put(categoriesApiResponseSuccess(GET_CATEGORIES, response.data));
  } catch (error) {
    yield put(categoriesApiResponseError(GET_CATEGORIES, error));
  }
}

function* onAddNewCategory({ payload: category }) {

  try {
    const response = yield call(addNewCategory, category);
    yield put(addCategorySuccess(response));
    toast.success("Category Added Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(addCategoryFail(error));
    toast.error("Category Added Failed", { autoClose: 3000 });
  }
}

// function* onUpdateCategory({ payload: category }) {
//   try {
//     const response = yield call(updateCategory, category);

//     yield put(updateCategorySuccess(response));
//     toast.success("Category Updated Successfully", { autoClose: 3000 });
//   } catch (error) {
//     yield put(updateCategoryFail(error));
//     toast.error("Category Updated Failed", { autoClose: 3000 });
//   }
// }
function* onUpdateCategory({ payload: { category, formData } }) {
try {
  let uploadResponse;

  // Check if an image is selected (formData contains a selected file)
  if (formData && formData.get("image")) {
    // Dispatch the uploadNewImage action with the formData & Wait for the upload to succeed before proceeding
    yield put(uploadNewImage(formData));
    const action = yield take([UPLOAD_IMAGE_SUCCESS, UPLOAD_IMAGE_FAIL]);
    if (action.type === UPLOAD_IMAGE_SUCCESS) {
      uploadResponse = action.payload;
    } else {
      throw new Error("Image Upload Failed");
    }
  }

  // Replace backslashes in image URL with forward slashes & update the image field in the category object with the new URL
  const formattedImageUrl = uploadResponse?.url?.replace(/\\/g, "/");
  const updatedCategory = {
    ...category,
    image: formattedImageUrl,
  };

  // Call the API function to update the category & Dispatch the updateCategorySuccess action with the received data
  const updateCategoryResponse = yield call(updateCategory, updatedCategory);
  yield put(updateCategorySuccess(updateCategoryResponse));

  toast.success("Category Updated Successfully", { autoClose: 2000 });
} catch (error) {
  yield put(updateCategoryFail(error));
  toast.error("Category Updated Failed", { autoClose: 2000 });
}
}


function* onDeleteCategory({ payload: category }) {
  try {
    const response = yield call(deleteCategory, category);
    yield put(deleteCategorySuccess({ category, ...response }));
    toast.success("Category Delete Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(deleteCategoryFail(error));
    toast.error("Category Delete Failed", { autoClose: 3000 });
  }
}



export function* watchGetCategories() {
  yield takeEvery(GET_CATEGORIES, getCategories);
}

export function* watchUpdateCategory() {
  yield takeEvery(UPDATE_CATEGORY, onUpdateCategory);
}

export function* watchDeleteCategory() {
  yield takeEvery(DELETE_CATEGORY, onDeleteCategory);
}

export function* watchAddNewCategory() {
  yield takeEvery(ADD_NEW_CATEGORY, onAddNewCategory);
}

function* CategoryManager() {
  yield all([
    fork(watchGetCategories),
    fork(watchAddNewCategory),
    fork(watchUpdateCategory),
    fork(watchDeleteCategory),
  ]);
}

export default CategoryManager;
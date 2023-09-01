import { call, put, takeEvery, all, fork } from "redux-saga/effects";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Invoice Redux States
import {

  GET_CATEGORIES,
  ADD_NEW_CATEGORY,
  DELETE_CATEGORY,
  UPDATE_CATEGORY,
} from "./actionType";

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

function* onUpdateCategory({ payload: category }) {
  try {
    const response = yield call(updateCategory, category);

    yield put(updateCategorySuccess(response));
    toast.success("Category Updated Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(updateCategoryFail(error));
    toast.error("Category Updated Failed", { autoClose: 3000 });
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
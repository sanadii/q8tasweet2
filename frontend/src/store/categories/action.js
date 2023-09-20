import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  
  GET_CATEGORIES,
  UPDATE_CATEGORY,
  UPDATE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_FAIL,
  ADD_NEW_CATEGORY,
  ADD_CATEGORY_SUCCESS,
  ADD_CATEGORY_FAIL,
  DELETE_CATEGORY,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAIL,
} from "./actionType";

// common success
export const categoriesApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

// common error
export const categoriesApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getCategories = () => ({
  type: GET_CATEGORIES,
});

export const updateCategory = (category) => ({
  type: UPDATE_CATEGORY,
  payload: category,
});

export const updateCategorySuccess = (category) => ({
  type: UPDATE_CATEGORY_SUCCESS,
  payload: category,
});

export const updateCategoryFail = error => ({
  type: UPDATE_CATEGORY_FAIL,
  payload: error,
});

export const addNewCategory = category => ({
  type: ADD_NEW_CATEGORY,
  payload: category,
});

export const addCategorySuccess = category => ({
  type: ADD_CATEGORY_SUCCESS,
  payload: category,
});

export const addCategoryFail = error => ({
  type: ADD_CATEGORY_FAIL,
  payload: error,
});

export const deleteCategory = category => ({
  type: DELETE_CATEGORY,
  payload: category,
});

export const deleteCategorySuccess = category => ({
  type: DELETE_CATEGORY_SUCCESS,
  payload: category,
});

export const deleteCategoryFail = error => ({
  type: DELETE_CATEGORY_FAIL,
  payload: error,
});
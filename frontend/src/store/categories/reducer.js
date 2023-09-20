import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  GET_CATEGORIES,
  ADD_CATEGORY_SUCCESS,
  ADD_CATEGORY_FAIL,
  UPDATE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_FAIL,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAIL,
} from "./actionType";

const initialState = {
  categories: [],
  subCategories: [],
  error: {},
};

const Categories = (state = initialState, action) => {

  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {

        case GET_CATEGORIES:
          return {
            ...state,
            categories: action.payload.data.categories,
            subCategories: action.payload.data.subCategories,
          };
        default:
          return { ...state };
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_CATEGORIES:
          return {
            ...state,
            error: action.payload.error,
          };
        default:
          return { ...state };
      }

    case ADD_CATEGORY_SUCCESS:
      return {
        ...state,
        categoryList: [...state.categoryList, action.payload],
      };

    case ADD_CATEGORY_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_CATEGORY_SUCCESS:
      return {
        ...state,
        categories: state.categories.map(category =>
          category.id.toString() === action.payload.id.toString()
            ? { ...category, ...action.payload }
            : category
        ),
      };

    case UPDATE_CATEGORY_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_CATEGORY_SUCCESS:
      return {
        ...state,
        categories: state.categories.filter(
          category => category.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_CATEGORY_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export default Categories;
<<<<<<< HEAD
import {
  GET_IMAGE_s,
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_IMAGE_FAIL,
  UPDATE_IMAGE_SUCCESS,
  UPDATE_IMAGE_FAIL,
  DELETE_IMAGE_SUCCESS,
  DELETE_IMAGE_FAIL,
} from "./actionType";

const INIT_STATE = {
  images: [],
};

const uploadImage = (state = INIT_STATE, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_IMAGE_s:
          return {
            ...state,
            images: action.payload.data,
            isImageCreated: false,
            isImageSuccess: true,
          };

        default:
          return { ...state };
      }

    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_IMAGE_s:
          return {
            ...state,
            error: action.payload.error,
            isImageCreated: false,
            isImageSuccess: true,
          };

        default:
          return { ...state };
      }

    case GET_IMAGE_s: {
      return {
        ...state,
        isImageCreated: false,
      };
    }

    case UPLOAD_IMAGE_SUCCESS:
      return {
        ...state,
        isImageCreated: true,
        images: [...state.images, action.payload.data],
        isImageAdd: true,
        isImageAddFail: false,
      };

    case UPLOAD_IMAGE_FAIL:
      return {
        ...state,
        error: action.payload,
        isImageAdd: false,
        isImageAddFail: true,
      };

    case UPDATE_IMAGE_SUCCESS:
      return {
        ...state,
        images: state.images.map((image) =>
          image._id.toString() === action.payload.data._id.toString()
            ? { ...image, ...action.payload.data }
            : image
        ),
        isImageUpdate: true,
        isImageUpdateFail: false,
      };

    case UPDATE_IMAGE_FAIL:
      return {
        ...state,
        error: action.payload,
        isImageUpdate: false,
        isImageUpdateFail: true,
      };

    case DELETE_IMAGE_SUCCESS:
      return {
        ...state,
        images: state.images.filter(
          (image) =>
            image._id.toString() !== action.payload.image.toString()
        ),
        isImageDelete: true,
        isImageDeleteFail: false,
      };

    case DELETE_IMAGE_FAIL:
      return {
        ...state,
        error: action.payload,
        isImageDelete: false,
        isImageDeleteFail: true,
      };

    default:
      return { ...state };
  }
};

export default uploadImage;
=======
import {
  GET_IMAGE_s,
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_IMAGE_FAIL,
  UPDATE_IMAGE_SUCCESS,
  UPDATE_IMAGE_FAIL,
  DELETE_IMAGE_SUCCESS,
  DELETE_IMAGE_FAIL,
} from "./actionType";

const INIT_STATE = {
  images: [],
};

const uploadImage = (state = INIT_STATE, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_IMAGE_s:
          return {
            ...state,
            images: action.payload.data,
            isImageCreated: false,
            isImageSuccess: true,
          };

        default:
          return { ...state };
      }

    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_IMAGE_s:
          return {
            ...state,
            error: action.payload.error,
            isImageCreated: false,
            isImageSuccess: true,
          };

        default:
          return { ...state };
      }

    case GET_IMAGE_s: {
      return {
        ...state,
        isImageCreated: false,
      };
    }

    case UPLOAD_IMAGE_SUCCESS:
      return {
        ...state,
        isImageCreated: true,
        images: [...state.images, action.payload.data],
        isImageAdd: true,
        isImageAddFail: false,
      };

    case UPLOAD_IMAGE_FAIL:
      return {
        ...state,
        error: action.payload,
        isImageAdd: false,
        isImageAddFail: true,
      };

    case UPDATE_IMAGE_SUCCESS:
      return {
        ...state,
        images: state.images.map((image) =>
          image._id.toString() === action.payload.data._id.toString()
            ? { ...image, ...action.payload.data }
            : image
        ),
        isImageUpdate: true,
        isImageUpdateFail: false,
      };

    case UPDATE_IMAGE_FAIL:
      return {
        ...state,
        error: action.payload,
        isImageUpdate: false,
        isImageUpdateFail: true,
      };

    case DELETE_IMAGE_SUCCESS:
      return {
        ...state,
        images: state.images.filter(
          (image) =>
            image._id.toString() !== action.payload.image.toString()
        ),
        isImageDelete: true,
        isImageDeleteFail: false,
      };

    case DELETE_IMAGE_FAIL:
      return {
        ...state,
        error: action.payload,
        isImageDelete: false,
        isImageDeleteFail: true,
      };

    default:
      return { ...state };
  }
};

export default uploadImage;
>>>>>>> sanad

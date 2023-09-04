import axios from "axios";
import { api } from "../config";

// default
axios.defaults.baseURL = api.API_URL;

// content type
axios.defaults.headers.post["Content-Type"] = "application/json";

// content type
const token = JSON.parse(sessionStorage.getItem("authUser")) ? JSON.parse(sessionStorage.getItem("authUser")).token : null;
// const token = JSON.parse(sessionStorage.getItem("authUser")) ? JSON.parse(sessionStorage.getItem("authUser")).jwt : null;


if (token)
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;

// intercepting to capture errors
axios.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    let message;
    switch (error.status) {
      case 500:
        message = "Internal Server Error";
        break;
      case 401:
        message = "Invalid credentials";
        break;
      case 404:
        message = "Sorry! the data you are looking for could not be found";
        break;
      default:
        message = error.message || error;
    }
    return Promise.reject(message);
  }
);
//* Sets the default authorization
 const setAuthorization = (token) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

class APIClient {

  // Fetches data from given url
  //  get = (url, params) => {
  //   return axios.get(url, params);
  // };

  // TODO In the below  code, if params is undefined, axios will automatically exclude it.
  // There's one point in the get function where you seem to be passing params in the axios.get request regardless of whether params exist or not.
  // This can be simplified by using axios's own parameters serialization method.
  get = (url, params) => {
    let response;

    let paramKeys = [];

    if (params) {
      Object.keys(params).map(key => {
        paramKeys.push(key + '=' + params[key]);
        return paramKeys;
      });

      const queryString = paramKeys && paramKeys.length ? paramKeys.join('&') : "";
      response = axios.get(`${url}?${queryString}`, params);
    } else {
      response = axios.get(`${url}`, params);
    }

    return response;
  };

  // post given data to url
  create = (url, data) => {
    return axios.post(url, data);
  };

  //  Updates data
  update = (url, data) => {
    return axios.patch(url, data);
  };

  put = (url, data) => {
    return axios.put(url, data);
  };
  //Delete
  delete = (url, config) => {
    return axios.delete(url, { ...config });
  };
}

const getLoggedinUser = () => {
  const user = sessionStorage.getItem("authUser");
  // console.log(user);

  if (!user) {
    return null;
  } else {
    return JSON.parse(user);
  }

};

const user = getLoggedinUser();


export { APIClient, setAuthorization, getLoggedinUser };
import axios from "axios";
import { api } from "../config";
import { getCurrentUser } from "../store/actions";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

// Default axios settings
axios.defaults.baseURL = api.API_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";

// Request interceptor for setting the Authorization header
axios.interceptors.request.use(
  (config) => {
    const token = JSON.parse(sessionStorage.getItem("authUser"))?.access_token;
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to capture errors
axios.interceptors.response.use(
  (response) => (response.data ? response.data : response),
  (error) => {
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

/**
 * Sets the default authorization
 * @param {string} token
 */
const setAuthorization = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

class APIClient {
  get = (url, params) => {
    const queryString = params
      ? Object.entries(params)
          .map(([key, value]) => `${key}=${value}`)
          .join("&")
      : "";
    return axios.get(queryString ? `${url}?${queryString}` : url);
  };

  create = (url, data) => {
    return axios.post(url, data);
  };

  update = (url, data) => {
    return axios.patch(url, data);
  };

  put = (url, data) => {
    return axios.put(url, data);
  };

  delete = (url, config) => {
    return axios.delete(url, { ...config });
  };
}

const getLoggedinUser = () => {
  const user = sessionStorage.getItem("authUser");
  return user ? JSON.parse(user) : null;
};

export { APIClient, setAuthorization, getLoggedinUser };

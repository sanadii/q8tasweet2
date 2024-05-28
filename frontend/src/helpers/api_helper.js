import axios from "axios";
import { api } from "../config";

// Default axios settings
axios.defaults.baseURL = api.API_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;

// Request interceptor for setting the Authorization header
axios.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("authUser"))?.accessToken;
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    // Retrieve CSRF token from cookie and set it to header
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Utility function to get a cookie by name
function getCookie(name) {
  let cookieValue = null;
  if (document?.cookie && document?.cookie !== '') {
    const cookies = document?.cookie?.split(';');
    for (let i = 0; i < cookies?.length; i++) {
      const cookie = cookies[i]?.trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie?.substring(name?.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Response interceptor to capture errors
axios.interceptors.response.use(response => response.data ? response.data : response, error => {
  const customMessage = handleHTTPError(error.response);
  return Promise.reject(customMessage || "An unexpected error occurred");
});

// Handle different types of HTTP errors
function handleHTTPError(response) {
  if (response) {
    const { status, data } = response;
    switch (status) {
      case 401:
        localStorage.removeItem("authUser");
        window.location.href = "/login";
        return "بيانات الاعتماد غير صالحة";
      case 500:
        return "خطأ في الخادم الداخلي";
      case 404:
        return "عذرًا! البيانات التي تبحث عنها غير موجودة";
      case 400:
        return data.message || "طلب خاطئ";
      default:
        return data.error || "حدث خطأ غير متوقع";
    }
  }
}

// axios.interceptors.response.use(
//   (response) => (response.data ? response.data : response),
//   (error) => {
//     if (error.response) {
//       const { status, data } = error.response;
//       let message;

//       // Check for unauthorized error
//       if (status === 401) {
//         localStorage.removeItem("authUser");
//         window.location.href = "/login";
//       }
//       switch (status) {
//         case 500:
//           message = "خطأ في الخادم الداخلي";
//           break;
//         case 401:
//           message = "بيانات الاعتماد غير صالحة";
//           break;
//         case 404:
//           message = "عذرًا! البيانات التي تبحث عنها غير موجودة";
//           break;
//         default:
//           message = data.error || "حدث خطأ غير متوقع";
//       }
//       // Return the error message
//       return Promise.reject(message);
//     }

//     // For errors without a response, return a generic error message
//     return Promise.reject("An unexpected error occurred");
//   }
// );

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

  delete = (url, data, config) => {
    return axios.delete(url, data, { ...config });
  };

  imageUpload = (url, data) => {
    const headers = {
      'Content-Type': "multipart/form-data"
    }
    return axios.post(url, data, { headers: headers });
  };
}

// Set Authorization
const setAuthorization = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};


const getLoggedinUser = () => {
  const user = localStorage.getItem("authUser");
  return user ? JSON.parse(user) : null;
};


// Create a function here called getToken
// Utility function to get the access token
const getToken = () => {
  const authUser = localStorage.getItem("authUser");
  return authUser ? JSON.parse(authUser).refreshToken : null;
};

export { APIClient, setAuthorization, getLoggedinUser, getToken, getCookie };

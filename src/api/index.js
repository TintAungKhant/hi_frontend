import axios from "axios"
import Cookies from "js-cookie";

const baseURL = "http://localhost:8000/api/v1";

function getCsrfCookie() {
  axios.defaults.withCredentials = true;
  return axios.get(`${baseURL}/csrf-cookie`);
}

const http = axios.create({
  baseURL,
  withCredentials: true,
});

http.interceptors.request.use(async (request) => {
  if (!Cookies.get("XSRF-TOKEN")) {
    await getCsrfCookie();
  }
  return request;
});

const postRegister = (data) => {
  return http.post("/register", data);
}

const postLogin = (data) => {
  return http.post("/login", data);
}

const postLogout = () => {
  return http.post("/logout");
}

const getProfile = (id = "") => {
  return http.get(`/profile/${id}`);
}

export {
  postRegister,
  postLogin,
  postLogout,
  getProfile
};
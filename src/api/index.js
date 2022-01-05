import axios from "axios"

const baseURL = process.env.REACT_APP_BASE_URL;

const http = axios.create({
  baseURL,
});

http.interceptors.request.use(async (request) => {
  let bearer_token = localStorage.getItem("BEARER_TOKEN");
  if (bearer_token) {
    request.headers.Authorization = `Bearer ${bearer_token}`;
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
  return http.get(`/profile${id ? "/"+id : ""}`);
}

const getFriendsExplore = (params) => {
  return http.get("/friends/explore", {
    params
  });
}

const postAddContact = (id) => {
  return http.post(`/friends/${id}/add`);
}

const postAcceptContact = (id) => {
  return http.post(`/friends/${id}/accept`);
}

const postDeleteContact = (id) => {
  return http.post(`/friends/${id}/delete`);
}

const getContacts = (params) => {
  return http.get("/friends", {
    params
  });
}

const getConversations = (params) => {
  return http.get(`/conversations`, {
    params
  });
}

const getConversation = (params) => {
  return http.get("/conversations/show", {
    params
  });
}

const getMessages = (params) => {
  return http.get("/conversations/messages", {
    params
  });
}

const postMessages = (data, params, headers = {}) => {
  return http.post("/conversations/messages", data, {
    params,
    ...headers
  });
}

const postBroadcastingAuth = (data) => {
  return http.post("/broadcasting/auth", data);
}

const postProfile = (data) => {
  return http.post("/profile", data);
}

const postProfileImage = (data) => {
  return http.post("/profile/image", data, {
    "Content-Type": "multipart/form-data"
  });
}

export {
  postRegister,
  postLogin,
  postLogout,
  getProfile,
  getFriendsExplore,
  postAddContact,
  postAcceptContact,
  postDeleteContact,
  getContacts,
  getConversations,
  getConversation,
  getMessages,
  postMessages,
  postBroadcastingAuth,
  postProfile,
  postProfileImage
};
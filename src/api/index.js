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

const getConversations = (id) => {
    return http.get(`/conversations`);
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

const postMessages = (params, data) => {
    return http.post("/conversations/messages", data, {params});
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
    postMessages
};
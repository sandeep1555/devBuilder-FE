import { BASE_URL } from "../Constants/Constants";

import axios from "axios"
import apiClient from "../Contexts/authInterceptor";


export const login = async (email, password) => {

    const response = await axios.post(BASE_URL + "login", { emailId: email, password: password }, { withCredentials: true });
    return response;
}

export const signUp = async (firstName, lastName, email, password, group) => {
    const response = await axios.post(BASE_URL + "signup", { firstName: firstName, lastName: lastName, emailId: email, password: password, group: group }, { withCredentials: true });
    console.log(response)
    return response;
}

export const getUserDetailsApi = async () => {
    const response = await apiClient.get(BASE_URL + "account/detail/", { withCredentials: true });
    return response;
}

export const editUserDetails = async (userId, firstName, lastName) => {
    const response = await apiClient.put(BASE_URL + "update/profile/" + userId, { firstName: firstName, lastName: lastName })
    return response
}
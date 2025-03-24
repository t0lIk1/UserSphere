// api.ts

import axiosInstance from "../axiosInstance.ts";
import {API_BASE_URL} from "../config.ts";

export const login = async (email: string, password: string) => {
    const response = await axiosInstance.post(`${API_BASE_URL}/auth/login`, { email, password });
    return response.data;
};
export const register = async (name: string, email: string, password: string) => {
    console.log(API_BASE_URL)
    const response = await axiosInstance.post(`${API_BASE_URL}/auth/registration`, {name, email, password});
    return response.data;
};

export const fetchUsers = async () => {
    const response = await axiosInstance.get(`${API_BASE_URL}/users`);
    return response.data;
};

export const getUserStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('token not found in localStorage');
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    const email = payload.email;
    if (!email) {
        throw new Error('Email not found in token');
    }
    const response = await axiosInstance.get(`${API_BASE_URL}/users/${email}`);
    return response.data.isBlocked;
};

export const blockUsers = async (userIds: number[]) => {
    const response = await axiosInstance.put(`${API_BASE_URL}/users/block`, {ids: userIds});
    return response.data;
};

export const unblockUsers = async (userIds: number[]) => {
    const response = await axiosInstance.put(`${API_BASE_URL}/users/unblock`, {ids: userIds});
    return response.data;
};

export const deleteUsers = async (userIds: number[]) => {
    const response = await axiosInstance.delete(`${API_BASE_URL}/users/delete`, { data: { ids: userIds } });
    return response.data;
};
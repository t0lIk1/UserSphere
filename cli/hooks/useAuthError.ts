// hooks/useAuthError.ts
import {useEffect} from 'react';
import axiosInstance from "../src/axiosInstance.ts";

const useAuthError = (callback?: () => void) => {
    useEffect(() => {
        const interceptor = axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401 || error.response?.status === 403) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    callback?.();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosInstance.interceptors.response.eject(interceptor);
        };
    }, [callback]);
};

export default useAuthError;
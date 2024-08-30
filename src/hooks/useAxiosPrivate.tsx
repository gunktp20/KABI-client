import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { logout } from "../features/auth/auth.slice";
import api from "../services/api";
import { useEffect } from "react";

const useAxiosPrivate = () => {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const navigate = useNavigate()

  useEffect(() => {
    const requestIntercept = api.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const pervRequest = error?.config;
        if (error?.response?.status === 403 && !pervRequest._retry) {
          dispatch(logout())
          navigate("/session-expired")
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestIntercept);
      api.interceptors.response.eject(responseIntercept);
    };
  }, [token]);

  return api;
};

export default useAxiosPrivate;

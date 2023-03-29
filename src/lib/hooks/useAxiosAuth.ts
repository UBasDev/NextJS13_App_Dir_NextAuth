"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import axiosInstances from "../axios/axios";
import { useRefreshToken } from "./useRefreshToken";

const useAxiosAuth = () => {
  const session: any = useSession();
  const refreshToken = useRefreshToken();

  useEffect(() => {
    const requestInterceptor =
      axiosInstances.axiosAuthInstance.interceptors.request.use(
        (config) => {
          if (!config.headers["Authorization"]) {
            config.headers[
              "Authorization"
            ] = `Bearer ${session?.data?.user?.accessToken}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
      );

    const responseInterceptor =
      axiosInstances.axiosAuthInstance.interceptors.response.use(
        (response) => {
          return response;
        },
        async (error) => {
          const previousRequest = error.config;
          if (error.response.status === 403 && !previousRequest.sent) {
            previousRequest.sent = true;
            await refreshToken();
            previousRequest.headers[
              "Authorization"
            ] = `Bearer ${session?.data?.user?.accessToken}`;
            return axiosInstances.axiosAuthInstance(previousRequest);
          }
          return Promise.reject(error);
        }
      );

    return () => {
      axiosInstances.axiosAuthInstance.interceptors.request.eject(
        requestInterceptor
      );
      axiosInstances.axiosAuthInstance.interceptors.response.eject(
        responseInterceptor
      );
    };
  }, [session]);
  return axiosInstances.axiosAuthInstance;
};

export default useAxiosAuth;

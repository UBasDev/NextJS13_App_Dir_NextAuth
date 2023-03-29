"use client";
import { signOut, useSession } from "next-auth/react";
import axiosInstances from "../axios/axios";

export const useRefreshToken = () => {
  const session: any = useSession();
  const refreshToken = async () => {
    const res: any = await axiosInstances.axiosCommonInstance
      .post("/auth/refreshToken", {
        refreshToken: session?.data?.user?.refreshToken,
      })
      .catch((error) => {
        console.log("userefreshToken", error);
        if (error.response?.status == 401) {
          signOut();
        }
      });

    if (session)
      session.data.user.accessToken = res.data.newGeneratedAccessToken;
  };
  return refreshToken;
};

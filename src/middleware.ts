import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import authOptions from "./lib/auth/auth";
import { getServerSession } from "next-auth/next";

const sensitiveRoutes = ["/dashboard"];

export default withAuth(
  async function middleware(req, res) {
    const token = await getToken({ req });
    console.log("MIDDLEWARE TOKEn", token);

    const isAuth = !!token;
    const pathname = req.nextUrl.pathname;
    return NextResponse.next();
  },
  {
    callbacks: {
      async authorized() {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        return true;
      },
    },
  }
);
export const config = {
  matcher: ["/", "/auth/sign_in", "/dashboard/:path*", "/api/:path*"],
};

import { NextRequest, NextResponse } from "next/server";
import { validate } from "./app/actions/utils";
import { cookies } from "next/headers";

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const protectedRoutes = ["/home"];
  const publicRoutes = ["/", "/signup"];
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  const cookieStore = cookies();
  const auth = (await cookieStore).get("user");
  const cookie = await validate(auth?.value);

  if (isProtectedRoute && !cookie) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (isPublicRoute && cookie) {
    return NextResponse.redirect(new URL("/home", req.nextUrl));
  }

  return NextResponse.next();
}

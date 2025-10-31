import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const authPaths = ["/auth/login", "/auth/signup"];

export async function middleware(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const nextUrl = request.nextUrl.pathname;

    if (!session) {
        if (!authPaths.includes(nextUrl)) {
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }
    } else {
        if (authPaths.includes(nextUrl)) {
            return NextResponse.redirect(new URL("/", request.url));
        } else {
            return NextResponse.next();
        }
    }
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
    runtime: "nodejs",
};

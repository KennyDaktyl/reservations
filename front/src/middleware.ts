import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const { nextUrl } = request;

    const isApiAuthRoute = nextUrl.pathname.startsWith("/api");

    if (isApiAuthRoute) {
        return NextResponse.next();
    }

    const response = NextResponse.next();

    response.headers.set("X-Middleware-Status", "Active");

    return response;
}

export async function handleResponseStatus(request: NextRequest, response: Response) {
    if (response.status === 401) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (response.status === 404) {
        return NextResponse.rewrite(new URL("/404", request.url));
    }

    return response;
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

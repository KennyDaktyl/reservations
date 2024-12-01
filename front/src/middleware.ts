import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const { nextUrl } = request;

    // Sprawdzenie, czy żądanie dotyczy API
    const isApiAuthRoute = nextUrl.pathname.startsWith("/api");

    // Jeśli API, przepuszczamy żądanie
    if (isApiAuthRoute) {
        return NextResponse.next();
    }

    // Przechwytywanie odpowiedzi
    const response = NextResponse.next();

    // Middleware obsługujący status odpowiedzi
    response.headers.set("X-Middleware-Status", "Active");

    return response;
}

export async function handleResponseStatus(request: NextRequest, response: Response) {
    // Przykład logiki na podstawie statusu odpowiedzi
	console.log(response);
    if (response.status === 401) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (response.status === 404) {
        return NextResponse.rewrite(new URL("/404", request.url));
    }

    // Dla innych statusów
    return response;
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

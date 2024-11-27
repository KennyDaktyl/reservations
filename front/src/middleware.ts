import { type NextRequest, NextResponse } from "next/server";

export function auth(request: NextRequest) {
	const { nextUrl } = request;
	const isApiAuthRoute = nextUrl.pathname.startsWith("/api");

	if (isApiAuthRoute) {
		return NextResponse.next();
	}
	return null;
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

export default auth;

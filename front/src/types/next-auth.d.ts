import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
	interface Session {
		user: {
			accessToken?: string;
			role?: "user" | "admin";
		} & DefaultSession["user"];
	}

	interface User {
		accessToken?: string;
		role?: "user" | "admin";
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		accessToken?: string;
		role?: "user" | "admin";
	}
}

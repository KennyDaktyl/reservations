import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { signJWT, verifyJWT } from "@/lib";

export const { handlers, signIn, signOut, auth } = NextAuth({
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken; 
                token.role = user.role;
                token.email = user.email; 
                token.id = user.id; 
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.email = token.email ?? "";
                session.user.accessToken = token.accessToken as string;
                session.user.role = token.role as "user" | "admin";
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 60 * 60,
    },
    jwt: {
        async encode({ token }) {
            if (!token) {
                throw new Error("Token is undefined during encode.");
            }
            return signJWT(token);
        },
        async decode({ token }) {
            if (!token) {
                console.error("Token is undefined during decode.");
                return null;
            }

            const decoded = verifyJWT(token);
            if (!decoded) {
                console.error("Failed to verify JWT during decode.");
                return null;
            }
            return decoded;
        },
    },
    secret: process.env.AUTH_SECRET,
    ...authConfig,
});

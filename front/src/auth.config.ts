import type { NextAuthConfig, User } from "next-auth";
import { AuthorizeSchema } from "@/app/schemas";
import Credentials from "next-auth/providers/credentials";

type AppUser = User & {
    role: "user" | "admin"; 
    accessToken: string;  
};

const authConfig: NextAuthConfig = {
    providers: [
        Credentials({
            async authorize(credentials) {
                const validatedFields = AuthorizeSchema.safeParse(credentials);

                if (validatedFields.success) {
                    return {
                        email: validatedFields.data.username,
                        accessToken: validatedFields.data.token,
                        role: validatedFields.data.role as "user" | "admin", 
                    } as AppUser;
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as AppUser).role;
                token.accessToken = (user as AppUser).accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role;
                session.user.accessToken = token.accessToken;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
};

export default authConfig;

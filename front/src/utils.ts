import { cookies } from "next/headers";
import { decodeAccessToken } from "./lib";

export const getAccessToken = (): string | null => {
    if (typeof window === "undefined") {
        const cookieStore = cookies();
        const sessionToken = cookieStore.get("authjs.session-token")?.value;

        if (!sessionToken) {
            console.warn("Nie znaleziono ciasteczka authjs.session-token (serwer)");
            return null;
        }

        return decodeAccessToken(sessionToken);
    } else {
        const sessionToken = document.cookie
            .split("; ")
            .find((row) => row.startsWith("authjs.session-token="))
            ?.split("=")[1];

        if (!sessionToken) {
            console.warn("Nie znaleziono ciasteczka authjs.session-token (klient)");
            return null;
        }

        return decodeAccessToken(sessionToken);
    }
};

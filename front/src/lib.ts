import jwt, { decode } from "jsonwebtoken";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";``

const secret = process.env.AUTH_SECRET || "default_secret_key";
const key = new TextEncoder().encode(secret); // Dodajemy deklarację `key`

/**
 * Sign a new JWT token.
 * @param payload - The data to include in the token.
 * @returns A signed JWT token as a string.
 */
export function signJWT(payload: jwt.JwtPayload): string {
    return jwt.sign(payload, secret, { algorithm: "HS256" });
}

/**
 * Verify and decode a JWT token.
 * @param token - The token to verify and decode.
 * @returns The decoded payload.
 */
export function verifyJWT(token: string): jwt.JwtPayload | null {
    try {
        return jwt.verify(token, secret, { algorithms: ["HS256"] }) as jwt.JwtPayload;
    } catch (error) {
        console.error("Failed to decode JWT:", error);
        return null;
    }
}

/**
 * Verify and decode an access token using `jose`.
 * @param accessToken - The access token to decrypt.
 * @returns The decoded payload.
 */
export async function decryptAccessToken(accessToken: string) {
    try {
        const { payload } = await jwtVerify(accessToken, key, { algorithms: ["HS256"] });
        return payload;
    } catch (error) {
        console.error("Failed to decode AccessToken:", error);
        throw new Error("Invalid token");
    }
}

/**
 * Decode a JWT token using `jsonwebtoken`.
 * @param token - The token to decode.
 * @returns The decoded payload.
 */
function decodeToken(token: string): jwt.JwtPayload | null {
    try {
        return jwt.verify(token, secret) as jwt.JwtPayload;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
}
/**
 * Get the user's role from the session token.
 * @returns The user's role or "guest" if it cannot be determined.
 */
export async function getUserRoleFromToken(): Promise<"guest" | "user" | "admin"> {
    try {
        const sessionToken = cookies().get("authjs.session-token")?.value;

        if (!sessionToken) {
            return "guest";
        }

        const decodedSession = decodeToken(sessionToken);

        if (!decodedSession) {
            return "guest";
        }

        const accessToken = decodedSession.accessToken;

        if (!accessToken) {
            return "guest";
        }

        const decodedAccessToken = decodeToken(accessToken);

        if (!decodedAccessToken || !decodedAccessToken.role) {
            return "guest";
        }

        return decodedAccessToken.role as "user" | "admin" | "guest";
    } catch (error) {
        console.error("Błąd podczas odczytu roli użytkownika:", error);
        return "guest";
    }
}

/**
 * Pobiera i rozkodowuje token JWT, zwraca pole `accessToken`.
 * @param jwtToken - Token JWT do rozkodowania.
 * @returns Wartość pola `accessToken` lub null, jeśli token jest nieprawidłowy.
 */
export const decodeAccessToken = (jwtToken: string): string | null => {
    if (!jwtToken) {
        console.warn("Token jest pusty.");
        return null;
    }

    // Rozkodowanie tokena bez weryfikacji podpisu
    const decoded = decode(jwtToken) as { accessToken?: string };

    if (!decoded || !decoded.accessToken) {
        console.warn("Nie znaleziono pola accessToken w tokenie.");
        return null;
    }

    return decoded.accessToken;
};
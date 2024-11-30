import { UserData } from "../types";
import { fetchGetApiData } from "./apiClient";

export const getUser = async (): Promise<UserData | null> => {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_AUTH_API_URL;

        if (!baseUrl) {
            throw new Error("NEXT_PUBLIC_AUTH_API_URL is not defined");
        }

        const url = `${baseUrl}/get_user`;
        const response = await fetchGetApiData<UserData, {}>({
            url,
            variables: {}, 
            cache: "no-cache",
        });

        if ("status" in response) {
            console.error("API Error:", response);
            return null;
        }

        return response;
    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
};

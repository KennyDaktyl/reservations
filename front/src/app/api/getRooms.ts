import { Room } from "@/app/types";
import { fetchGetApiData } from "./apiClient";

interface GetRoomsParams {
    page?: string;
    searchTerms?: string;
    [key: string]: unknown;
}

export const getRoomsList = async () => {
    try {

        const baseUrl = process.env.NEXT_PUBLIC_ROOMS_API_URL; 

        if (!baseUrl) {
            throw new Error("NEXT_PUBLIC_ROOMS_API_URL is not defined");
        }

        const url = `${baseUrl}/api/rooms/list_rooms?`; 

        const response = await fetchGetApiData<Room[], GetRoomsParams>({
            url, 
            variables: {},
            cache: "force-cache",
            next: { tags: ["rooms"] },
        });

        return response ?? [];
    } catch (error) {
        console.error("API Error:", error);
        return [];
    }
};

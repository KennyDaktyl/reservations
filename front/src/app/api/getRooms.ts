import { Room } from "@/app/types";
import { fetchGetApiData } from "./apiClient";

interface GetRoomsParams {
    min_capacity?: number;
    max_capacity?: number;
    equipment_ids?: number[];
    [key: string]: unknown;
}

export const getFilteredRooms = async (params: GetRoomsParams) => {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_ROOMS_API_URL;

        if (!baseUrl) {
            throw new Error("NEXT_PUBLIC_ROOMS_API_URL is not defined");
        }

        const url = `${baseUrl}/api/rooms/list_rooms`;

        const response = await fetchGetApiData<Room[], GetRoomsParams>({
            url,
            variables: params,
            cache: "no-cache",
        });

        return response ?? [];
    } catch (error) {
        console.error("API Error:", error);
        return [];
    }
};

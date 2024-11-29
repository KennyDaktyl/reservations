import { Room } from "../types";
import { fetchPostApiData } from "./fetchPostApiData";

export const updateRoom = async (id: number, data: { name: string; capacity: number; equipments?: number[] }): Promise<Room> => {
    const url = `${process.env.NEXT_PUBLIC_ROOMS_API_URL}/api/rooms/${id}`;
    try {
        const response = await fetchPostApiData<Room, typeof data>({
            url,
            body: data,
            method: "PUT",
        });

        return response!;
    } catch (error) {
        console.error("Failed to update room:", error);
        throw error;
    }
};

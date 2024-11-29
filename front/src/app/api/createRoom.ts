import { Room, RoomInput } from "../types";
import { fetchPostApiData } from "./fetchPostApiData";

export const createRoom = async (roomData: RoomInput): Promise<Room | null> => {
    try {
        const url = `${process.env.NEXT_PUBLIC_ROOMS_API_URL}/api/rooms/create_room`;

        const response = await fetchPostApiData<Room, RoomInput>({
            url,
            body: roomData,
            method: "POST",
        });

        return response;
    } catch (error) {
        console.error("Failed to create room:", error);
        return null; 
    }
};

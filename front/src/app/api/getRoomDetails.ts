import { Room } from "../types";
import { fetchGetApiData } from "./apiClient";

export const getRoomDetails = async (id: number): Promise<Room | { status: number }> => {
    const url = `${process.env.NEXT_PUBLIC_ROOMS_API_URL}/api/rooms/${id}`;
    return await fetchGetApiData<Room, {}>({ url, variables: {} });
};

import { fetchPostApiData } from "./fetchPostApiData";

export const deleteRoom = async (id: number): Promise<void> => {
    const url = `${process.env.NEXT_PUBLIC_ROOMS_API_URL}/api/rooms/${id}`;
    try {
        await fetchPostApiData<null, { room_id: number }>({
            url,
            body: { room_id: id },
            method: "DELETE",
        });
    } catch (error) {
        console.error("Failed to remove room:", error);
        throw error;
    }
};

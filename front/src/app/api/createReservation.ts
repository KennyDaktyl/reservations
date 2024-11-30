import { Room, UserData } from "../types";
import { fetchPostApiData } from "./fetchPostApiData";

export async function createReservation(data: {
    room_id: number;
    user_id: number;
    start_date: string;
    end_date: string;
    user_data: UserData;
    room_data: Room;
}) {
    try {
        const response = await fetchPostApiData<
            { id: number; room_id: number; user_id: number; start_date: string; end_date: string },
            typeof data
        >({
            url: `${process.env.NEXT_PUBLIC_RESERVATION_API_URL}/create_reservation`,
            body: data,
        });
        return response;
    } catch (error: any) {
        console.error("Error in createReservation:", error);
        throw error; 
    }
}

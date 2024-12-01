import { Reservation } from "../types";
import { fetchGetApiData } from "./apiClient";

interface GetReservationsParams {
    [key: string]: unknown; 
    is_active?: boolean;
    sort_by?: string;
    sort_order?: string;
    user_id?: number;
    room_id?: number;
    date_start?: string;
    date_end?: string;
}

export const getReservationsList = async (
    params: GetReservationsParams
): Promise<Reservation[]> => {
    const baseUrl = process.env.NEXT_PUBLIC_RESERVATION_API_URL;

    if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_RESERVATION_API_URL is not defined");
    }

    const url = `${baseUrl}/list_reservations`;

    const response = await fetchGetApiData<Reservation[], GetReservationsParams>({
        url,
        variables: params,
        cache: "force-cache",
        next: { tags: ["reservations"] },
    });
    if ("status" in response) {
        throw new Error(`API returned error with status ${response.status}`);
    }
    return response; 
};

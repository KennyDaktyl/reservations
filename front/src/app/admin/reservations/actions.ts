"use server";

import { getReservationsList } from "@/app/api/getReservations";
import { Reservation } from "@/app/types";

interface GetReservationsParams {
    is_active?: boolean;
    user_id?: number;
    room_id?: number;
    date_start?: string;
    date_end?: string;
    [key: string]: any; 
}

export const fetchReservationsAction = async (filters: GetReservationsParams): Promise<Reservation[]> => {
    try {
        const reservations = await getReservationsList(filters);
        return reservations;
    } catch (error) {
        console.error("Failed to fetch reservations:", error);
        return [];
    }
};

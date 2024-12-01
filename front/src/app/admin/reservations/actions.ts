"use server";

import { exportReservationsToXLSX } from "@/app/api/exportReservations";
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


interface ExportReservationsParams {
    date_start?: string;
    date_end?: string;
    is_active?: boolean;
    room_id?: number;
    user_id?: number;
    [key: string]: any;
}

export const fetchExportReservationsAction = async (filters: ExportReservationsParams): Promise<string> => {
    try {
        const blob = await exportReservationsToXLSX(filters);
        const url = URL.createObjectURL(blob);
        return url;
    } catch (error) {
        console.error("Failed to fetch export data:", error);
        throw new Error("Failed to export reservations");
    }
};
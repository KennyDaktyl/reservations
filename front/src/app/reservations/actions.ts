"use server";

import { createReservation } from "@/app/api/createReservation";
import { Room, UserData } from "../types";
import { revalidatePath, revalidateTag } from "next/cache";

interface CreateReservationData {
    room_id: number;
    user_id: number;
    start_date: string;
    end_date: string;
    user_data: UserData;
    room_data: Room;
}

export async function createReservationAction(data: CreateReservationData) {
    try {
        const response = await createReservation(data);
        revalidatePath("/reservations");
        revalidateTag("reservations");
        return { success: true, data: response };
    } catch (error: any) {

        if (error.status === 400 && error.details) {
            return {
                success: false,
                error: {
                    message: error.message,
                    details: error.details,
                },
            };
        }

        return { success: false, error: { message: error.message || "Nie udało się utworzyć rezerwacji." } };
    }
}


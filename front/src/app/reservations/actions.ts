"use server";

import { createReservation } from "@/app/api/createReservation";
import { createRoom } from "../api/createRoom";
import { revalidatePath, revalidateTag } from "next/cache";
import { deleteRoom } from "../api/deleteRoom";
import { addEquipmentToRoom } from "../api/addEquipmentToRoom";
import { CreateReservationData, CreateReservationErrorResponse, CreateReservationResponse, CreateReservationSuccessResponse, Room, UserData } from "../types";
import { deleteReservation } from "../api/deleteReservation";


export async function createReservationAction(
    data: CreateReservationData
): Promise<CreateReservationResponse> {
    try {
        const response: any = await createReservation(data);

        if ("success" in response && response.success === false) {
            return response as CreateReservationErrorResponse;
        }
        revalidatePath("/admin/rooms");
        revalidateTag("rooms");
        return response as CreateReservationSuccessResponse
    } catch (error: any) {
        return {
            success: false,
            error: {
                message: error.message || "Nie udało się utworzyć rezerwacji.",
            },
        };
    }
}

export const handleCreateRoomAction = async (data: { name: string; capacity: number; equipments?: number[] }) => {
    try {
        const newRoom = await createRoom(data);
        if (!newRoom) {
            throw new Error("Room creation failed");
        }
        revalidatePath("/admin/rooms");
        revalidateTag("rooms");
        return newRoom
    } catch (error) {
        console.error("Failed to create room:", error);
        throw new Error("Failed to create room");
    }
};


export const handleDeleteRoomAction = async (id: number) => {
    try {
        await deleteRoom(id);
        revalidatePath("/admin/rooms");
        revalidateTag("rooms");
    } catch (error) {
        console.error("Failed to delete room:", error);
        throw new Error("Failed to delete room");
    }
};


export const handleAddEquipmentToRoomAction = async (data: { roomId: number; equipmentId: number }): Promise<Room | null> => {
    try {
        const updatedRoom = await addEquipmentToRoom(data.roomId, data.equipmentId);

        if (!updatedRoom) {
            console.error("Failed to add equipment: Room not updated.");
            return null;
        }
        revalidatePath("/admin/rooms");
        revalidateTag("rooms");
        return updatedRoom; 
    } catch (error) {
        console.error("Failed to add equipment to room:", error);
        throw new Error("Failed to add equipment to room");
    }
};

export const handleRemoveReservationAction = async (data: { reservationId: number }) => {
    try {
        const response = await deleteReservation(data.reservationId);

        revalidatePath("/admin/reservations");
        revalidatePath("/reservations");
        revalidateTag("reservations");

        if (response === null) {
            return null; 
        }

        return response;
    } catch (error) {
        console.error("Failed to remove Reservation", error);
        throw error;
    }
};


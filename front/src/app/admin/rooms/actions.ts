"use server";

import { addEquipmentToRoom } from "@/app/api/addEquipmentToRoom";
import { createRoom } from "@/app/api/createRoom";
import { deleteRoom } from "@/app/api/deleteRoom";
import { removeEquipmentFromRoom } from "@/app/api/removeEquipmentFromRoom";
import { Room } from "@/app/types";
import { revalidatePath, revalidateTag } from "next/cache";

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

export const handleRemoveEquipmentFromRoomAction = async (data: { roomId: number; equipmentId: number }) => {
    try {
        const response = await removeEquipmentFromRoom(data.roomId, data.equipmentId);

        revalidatePath("/admin/rooms");
        revalidateTag("rooms");

        if (response === null) {
            return null; 
        }

        return response;
    } catch (error) {
        console.error("Failed to remove equipment from room:", error);
        throw error;
    }
};


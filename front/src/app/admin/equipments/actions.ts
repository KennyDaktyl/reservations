"use server";

import { createEquipment } from "@/app/api/createEquipment";
import { deleteEquipment } from "@/app/api/deleteEquipment";
import { revalidatePath, revalidateTag } from "next/cache";

export const handleCreateEquipmentAction = async (data: { name: string }) => {
    try {
        const newEquipment = await createEquipment(data);
        if (!newEquipment) {
            return { success: false, error: "Room creation failed" };
        }
        revalidatePath("/admin/equipments");
        revalidateTag("equipments");
        return { success: true, data: newEquipment };
    } catch (error: any) {
        console.error("Failed to create equipment:", error);
        return { success: false, error: error.message, status: error.status || 500 };
    }
};


export const handleDeleteEquipmentAction = async (id: number) => {
    try {
        console.log("Deleting equipment with ID:", id);

        await deleteEquipment(id);

        console.log("Equipment deleted successfully.");

        revalidatePath("/admin/equipments");
        revalidateTag("equipments");
        revalidateTag("equipments");
        revalidateTag("rooms");
    } catch (error) {
        console.error("Failed to delete equipment:", error);
        throw new Error("Failed to delete equipment");
    }
};
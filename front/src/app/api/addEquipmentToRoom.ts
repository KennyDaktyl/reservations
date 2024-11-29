import { fetchPostApiData } from "@/app/api/fetchPostApiData";
import { Room } from "../types";

export const addEquipmentToRoom = async (
    roomId: number,
    equipmentId: number
): Promise<Room | null> => {
    const url = `${process.env.NEXT_PUBLIC_ROOMS_API_URL}/api/room_equipments/add_room_equipment`;

    try {
        const response = await fetchPostApiData<Room, { room_id: number; equipment_id: number }>({
            url,
            body: { room_id: roomId, equipment_id: equipmentId },
            method: "POST",
        });

        return response; 
    } catch (error) {
        console.error("Failed to add equipment to room:", error);
        return null;
    }
};

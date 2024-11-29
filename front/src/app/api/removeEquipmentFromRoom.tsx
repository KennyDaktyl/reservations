import { Room } from "../types";
import { fetchPostApiData } from "./fetchPostApiData";

export const removeEquipmentFromRoom = async (roomId: number, equipmentId: number): Promise<Room | null> => {
    const url = `${process.env.NEXT_PUBLIC_ROOMS_API_URL}/api/room_equipments/remove_room_equipment`;

    try {
        const response = await fetchPostApiData<Room, { room_id: number; equipment_id: number }>({
            url,
            body: { room_id: roomId, equipment_id: equipmentId },
            method: "DELETE",
        });

        console.log("API response for removeEquipmentFromRoom:", response);
        return response;
    } catch (error) {
        console.error("Failed to remove equipment from room:", error);
        return null;
    }
};

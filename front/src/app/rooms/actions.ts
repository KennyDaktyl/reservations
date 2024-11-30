"use server";

import { getFilteredRooms } from "@/app/api/getRooms";
import { Room } from "@/app/types";

export const fetchFilteredRoomsAction = async (filters: {
    minCapacity?: number;
    maxCapacity?: number;
    equipmentIds?: number[];
}): Promise<Room[] | { status: number }> => {
    try {
        const rooms = await getFilteredRooms(filters);
        return rooms;
    } catch (error) {
        console.error("Failed to fetch filtered rooms:", error);
        return [];
    }
};

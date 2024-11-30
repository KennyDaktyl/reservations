import { Equipment, EquipmentInput } from "../types";
import { fetchPostApiData } from "./fetchPostApiData";

export const createEquipment = async (equipmentData: EquipmentInput): Promise<Equipment | null> => {

    const url = `${process.env.NEXT_PUBLIC_ROOMS_API_URL}/api/equipments/create_equipment`;

    try {
        const response = await fetchPostApiData<Equipment, EquipmentInput>({
            url,
            body: equipmentData,
            method: "POST",
        });

        return response;
    } catch (error) { 
        console.error("Failed to create equipment:", error);
        return null; 
    }
}

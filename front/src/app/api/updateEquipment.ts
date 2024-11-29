import { getAccessToken } from "@/utils";
import { Equipment, EquipmentInput } from "../types";

export const updateEquipment = async (id: number, equipmentData: Partial<EquipmentInput>): Promise<Equipment> => {
    const url = `${process.env.NEXT_PUBLIC_ROOMS_API_URL}/api/equipments/${id}`;
    return await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify(equipmentData),
    }).then((res) => {
        if (!res.ok) throw new Error("Failed to update equipment");
        return res.json();
    });
};

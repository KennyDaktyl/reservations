import { Equipment } from "../types";
import { fetchGetApiData } from "./apiClient";

export const getEquipmentDetails = async (id: number): Promise<Equipment> => {
    const url = `${process.env.NEXT_PUBLIC_ROOMS_API_URL}/api/equipments/${id}`;
    return await fetchGetApiData<Equipment, {}>({ url, variables: {} }) as Equipment;
};

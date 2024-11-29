import { Equipment } from "../types";
import { fetchGetApiData } from "./apiClient";


export const getEquipmentsList = async () => {
    try {

        const baseUrl = process.env.NEXT_PUBLIC_ROOMS_API_URL;

        if (!baseUrl) {
            throw new Error("NEXT_PUBLIC_ROOMS_API_URL is not defined");
        }

        const url = `${baseUrl}/api/equipments/list_equipments`; 

        const response = await fetchGetApiData<Equipment[], {}>({
            url,
            variables: {},
            cache: "force-cache",
            next: { tags: ["equipments"] },
        });
        return response ?? [];
    } catch (error) {
        console.error("API Error:", error);
        return [];
    }
};

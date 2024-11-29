import { getAccessToken } from "@/utils";

export const deleteEquipment = async (id: number): Promise<void> => {
    const url = `${process.env.NEXT_PUBLIC_ROOMS_API_URL}/api/equipments/${id}`;
    await fetch(url, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${getAccessToken()}`,
        },
    }).then((res) => {
        if (!res.ok) throw new Error("Failed to delete equipment");
    });
};

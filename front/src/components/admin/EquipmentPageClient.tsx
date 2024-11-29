"use client";

import { handleCreateEquipmentAction } from "@/app/admin/equipments/actions";
import { Equipment } from "@/app/types";
import { useState } from "react";
import EquipmentList from "./EquipmentList";
import EquipmentModal from "./EquipmentModal";
import { useRouter } from "next/navigation";

interface EquipmentsPageClientProps {
    equipments: Equipment[];
}

const RoomsPageClient = ({ equipments }: EquipmentsPageClientProps) => {
    const [equipmentList, setEquipmentList] = useState<Equipment[]>(equipments);
    const router = useRouter();

    const handleCreateEquipment = async (data: { name: string }) => {
        const transformedData = { ...data };

        const result = await handleCreateEquipmentAction(transformedData);

        if (!result.success) {
            console.error("Failed to create equipment:", result.error);
            console.log(result.status === 401)
            if (result.status === 401) {
                
                return;
            }
            return;
        } else {
            setEquipmentList((prevEquipments) => [...prevEquipments, result.data as Equipment]);
        }
    };

    const handleDeleteEquipment = (id: number) => {
        setEquipmentList((prevEquipments) => prevEquipments.filter((equipment) => equipment.id !== id));
    };

    return (
        <>
            <EquipmentModal onSubmit={handleCreateEquipment} />
            <EquipmentList equipments={equipmentList} onDeleteEquipment={handleDeleteEquipment} />
        </>
    );
};

export default RoomsPageClient;

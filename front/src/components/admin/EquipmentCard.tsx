import { handleDeleteEquipmentAction } from "@/app/admin/equipments/actions";
import { Equipment } from "@/app/types";
import { X } from "lucide-react";
import { useState } from "react";

interface EquipmentCardProps {
    equipment: Equipment;
    onDelete: (id: number) => void;
}

export default function EquipmentCard({ equipment, onDelete }: EquipmentCardProps) {

    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (isDeleting) return; 
        setIsDeleting(true);
        try {
            await handleDeleteEquipmentAction(equipment.id);
            onDelete(equipment.id); 
        } catch (error) {
            console.error("Failed to delete equipment:", error);
        } finally {
            setIsDeleting(false);
        }
    };
    
    return (
        <div className="relative p-4 bg-white shadow-md rounded-md hover:shadow-lg hover:ring-2 hover:ring-blue-400 transition">
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                aria-label="Usuń wyposażenie"
            >
                <X size={18} />
            </button>
            <h2 className="text-xl font-semibold mb-2">{equipment.name}</h2>
            <p className="text-gray-600">ID: {equipment.id}</p>
        </div>
    );
}

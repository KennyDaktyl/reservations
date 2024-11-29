import { Equipment } from "@/app/types";
import EquipmentCard from "./EquipmentCard";

interface EquipmentListProps {
    equipments: Equipment[];
    onDeleteEquipment: (id: number) => void;
}

export default function EquipmentList({ equipments, onDeleteEquipment }: EquipmentListProps) {
    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">Lista Wyposażenia</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {equipments.map((equipment) => (
                    <EquipmentCard key={equipment.id} equipment={equipment} onDelete={onDeleteEquipment} />
                ))}
            </div>
        </div>
    );
}

import { useDrag } from "react-dnd";
import React, { forwardRef } from "react";

interface DraggableEquipmentProps {
    equipment: { value: number; label: string };
}

const DraggableEquipment = forwardRef<HTMLDivElement, DraggableEquipmentProps>(
    ({ equipment }, ref) => {
        const [{ isDragging }, drag] = useDrag({
            type: "equipment",
            item: { id: equipment.value },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        });

        const combinedRef = (node: HTMLDivElement | null) => {
            drag(node);
            if (typeof ref === "function") {
                ref(node);
            } else if (ref) {
                ref.current = node;
            }
        };

        return (
            <div
                ref={combinedRef} 
                className={`p-4 bg-white shadow-md rounded-md transition cursor-pointer ${
                    isDragging ? "opacity-50" : "opacity-100"
                }`}
            >
                <h2 className="text-xl font-semibold mb-2">{equipment.label}</h2>
                <p className="text-gray-600">ID: {equipment.value}</p>
            </div>
        );
    }
);

export default DraggableEquipment;

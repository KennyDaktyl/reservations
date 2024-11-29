import { useDrop } from "react-dnd";
import React, { forwardRef, useState } from "react";
import { Room } from "@/app/types";
import { X } from "lucide-react";

interface DroppableRoomProps {
    room: Room;
    onAddEquipment: (roomId: number, equipmentId: number) => void;
    onRemoveEquipment: (roomId: number, equipmentId: number) => void;
    onDelete: (id: number) => void;
}

const DroppableRoom = forwardRef<HTMLDivElement, DroppableRoomProps>(
    ({ room, onAddEquipment, onRemoveEquipment, onDelete }, ref) => {
        const [{ isOver }, drop] = useDrop({
            accept: "equipment",
            drop: (item: { id: number }) => {
                onAddEquipment(room.id, item.id);
            },
            collect: (monitor) => ({
                isOver: monitor.isOver(),
            }),
        });

        const combinedRef = (node: HTMLDivElement | null) => {
            drop(node);
            if (typeof ref === "function") {
                ref(node);
            } else if (ref) {
                ref.current = node;
            }
        };

        return (
            <div
                ref={combinedRef}
                className={`relative p-6 bg-gray-50 shadow-md rounded-md transition ${
                    isOver ? "ring-2 ring-blue-400" : ""
                }`}
            >
                <button
                    onClick={() => onDelete(room.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    aria-label="Usuń pokój"
                >
                    <X size={18} />
                </button>
                <h2 className="text-xl font-semibold mb-4">{room.name}</h2>
                <p className="text-gray-600">Pojemność sali: {room.capacity}</p>
                <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Wyposażenie:</h3>
                    <ul className="grid grid-cols-2 gap-2">
                        {room.equipments.map((equipment) => (
                            <li
                                key={equipment.id}
                                className="p-2 bg-white border border-gray-200 rounded-md shadow-sm text-gray-700 text-sm flex justify-between items-center"
                            >
                                <span>{equipment.name}</span>
                                <button
                                    className="text-red-500 hover:text-red-700 transition"
                                    onClick={() => {
                                        console.log(`Clicked to remove equipment ID: ${equipment.id}`);
                                        onRemoveEquipment(room.id, equipment.id);
                                    }}
                                    aria-label={`Remove ${equipment.name}`}
                                >
                                    <X size={18} />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
);

export default DroppableRoom;

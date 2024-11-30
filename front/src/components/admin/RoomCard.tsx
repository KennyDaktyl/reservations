"use client";

import { Room } from "@/app/types";
import { useState } from "react";
import { X } from "lucide-react";

interface RoomCardProps {
    room: Room;
    onDelete?: (id: number) => void; 
}

export default function RoomCard({ room, onDelete }: RoomCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (isDeleting || !onDelete) return;
        setIsDeleting(true);
        try {
            await onDelete(room.id);
        } catch (error) {
            console.error("Failed to delete room:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="relative p-4 bg-white shadow-md rounded-md hover:shadow-lg hover:ring-2 hover:ring-blue-400 transition">
            {onDelete && (
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    aria-label="Usuń pokój"
                >
                    <X size={18} />
                </button>
            )}

            <h2 className="text-xl font-bold text-gray-800">{room.name}</h2>
            <p className="text-gray-600">Pojemność: {room.capacity}</p>
            <h3 className="mt-4 font-semibold">Wyposażenie:</h3>
            <ul className="list-disc list-inside text-gray-600">
                {room.equipments.length > 0 ? (
                    room.equipments.map((equipment: any) => (
                        <li key={equipment.id}>{equipment.name}</li>
                    ))
                ) : (
                    <li>Brak wyposażenia</li>
                )}
            </ul>
        </div>
    );
}

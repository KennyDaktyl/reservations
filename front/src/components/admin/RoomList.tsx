"use client";
import { Room } from "@/app/types";
import RoomCard from "./RoomCard";

interface RoomListProps {
    rooms: Room[];
    onDeleteRoom: (id: number) => void;
}

export default function RoomList({ rooms, onDeleteRoom }: RoomListProps) {
    const handleCreateRoom = async (data: { name: string; capacity: number }) => {
        try {
            console.log("Creating room:", data);
        } catch (error) {
            console.error("Failed to create room:", error);
        }
    };
    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">Lista Pokoi</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-1">
                {rooms.map((room) => (
                    <RoomCard key={room.id} room={room} onDelete={onDeleteRoom} />
                ))}
            </div>
        </div>
    );
}

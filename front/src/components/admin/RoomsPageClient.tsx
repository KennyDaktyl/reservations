"use client";

import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import RoomModal from "@/components/admin/RoomModal";
import { Room } from "@/app/types";
import {
    handleAddEquipmentToRoomAction,
    handleCreateRoomAction,
    handleRemoveEquipmentFromRoomAction,
    handleDeleteRoomAction,
} from "@/app/admin/rooms/actions";
import DroppableRoom from "./DroppableRoom";
import DraggableEquipment from "./DraggableEquipment";
import { useSessionStore } from "@/store";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface RoomsPageClientProps {
    rooms: Room[];
    equipments: { value: number; label: string }[];
}

const RoomsPageClient = ({ rooms, equipments }: RoomsPageClientProps) => {
    const [roomList, setRoomList] = useState<Room[]>(rooms);
    
    const router = useRouter();
    const role = useSessionStore((state) => state.role);
    if (role !== "admin") {
        toast.error("Brak dostępu");
        router.push("/auth/login");
    }
    
    const handleCreateRoom = async (data: { name: string; capacity: number; equipments?: { value: number }[] }) => {
        try {
            const transformedData = {
                ...data,
                equipments: data.equipments?.map((equipment) => equipment.value),
            };
            const newRoom = await handleCreateRoomAction(transformedData);
            setRoomList((prevRooms) => [...prevRooms, newRoom]);
        } catch (error) {
            console.error("Failed to create room:", error);
        }
    };

    const handleAddEquipmentToRoom = async (roomId: number, equipmentId: number) => {
        try {
            const updatedRoom = await handleAddEquipmentToRoomAction({ roomId, equipmentId });

            if (!updatedRoom) {
                console.error("Failed to add equipment: Room not updated.");
                return;
            }

            setRoomList((prevRooms) =>
                prevRooms.map((room) => (room.id === updatedRoom.id ? updatedRoom : room))
            );
        } catch (error) {
            console.error("Failed to add equipment to room:", error);
        }
    };

    const handleRemoveEquipmentFromRoom = async (roomId: number, equipmentId: number) => {
        try {
            const response = await handleRemoveEquipmentFromRoomAction({ roomId, equipmentId });
    
            if (response === null) {
    
                setRoomList((prevRooms) =>
                    prevRooms.map((room) => {
                        if (room.id === roomId) {
                            const updatedEquipments = room.equipments.filter(
                                (equipment) => equipment.id !== equipmentId
                            );
                            return { ...room, equipments: updatedEquipments };
                        }
                        return room;
                    })
                );
    
            } else {
                console.error("Unexpected response when removing equipment:", response);
            }
        } catch (error) {
            console.error("Failed to remove equipment from room:", error);
        }
    };
    
    const handleDeleteRoom = async (roomId: number) => {
        try {
            await handleDeleteRoomAction(roomId); 
            setRoomList((prevRooms) => prevRooms.filter((room) => room.id !== roomId));
        } catch (error) {
            console.error("Error deleting room:", error);
            alert("Nie udało się usunąć pokoju. Spróbuj ponownie.");
        }
    };
    
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex flex-row gap-6">
                <div className="flex-[3] mb-4">
                    <RoomModal onSubmit={handleCreateRoom} equipments={equipments} />
                    <h1 className="text-2xl font-semibold mb-4 mt-4">Pokoje</h1>
                    <div className="space-y-6">
                        {roomList.map((room) => (
                            <DroppableRoom
                                key={room.id}
                                room={room}
                                onAddEquipment={handleAddEquipmentToRoom}
                                onRemoveEquipment={handleRemoveEquipmentFromRoom}
                                onDelete={handleDeleteRoom}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex-[1]">
                    <h1 className="text-2xl font-semibold mb-4">Wyposażenie (D&D)</h1>
                    <div className="space-y-4">
                        {equipments.map((equipment) => (
                            <DraggableEquipment key={equipment.value} equipment={equipment} />
                        ))}
                    </div>
                </div>
            </div>
        </DndProvider>
    );
};

export default RoomsPageClient;

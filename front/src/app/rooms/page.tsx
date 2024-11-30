import RoomsPageClient from "@/components/rooms/RoomsPageClient";
import { getFilteredRooms } from "../api/getRooms";
import { getEquipmentsList } from "../api/getEquipments";
import { redirect } from "next/navigation";
import { Equipment, Room } from '../types';

export const dynamic = "force-dynamic";

export default async function RoomsPage() {

    const roomsResponse = await getFilteredRooms({});
    const equipmentsResponse = await getEquipmentsList();

    if ("status" in roomsResponse && roomsResponse.status === 401) {
        redirect("/auth/login");
    }

    if ("status" in equipmentsResponse && equipmentsResponse.status === 401) {
        redirect("/auth/login");
    }

    const rooms = roomsResponse as Room[];
    const equipments = (equipmentsResponse as Equipment[]).map((equipment) => ({
        value: equipment.id,
        label: equipment.name,
    }));
    
    return <RoomsPageClient rooms={rooms} equipments={equipments} />;
}
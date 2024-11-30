import { getEquipmentsList } from "@/app/api/getEquipments";
import { getFilteredRooms } from "@/app/api/getRooms";
import { Equipment, Room } from "@/app/types";
import RoomsPageClient from "@/components/admin/RoomsPageClient";
import { redirect } from "next/navigation";

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

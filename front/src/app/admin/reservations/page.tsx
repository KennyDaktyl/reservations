import { getReservationsList } from "@/app/api/getReservations";
import ReservationsPageClient from "@/components/admin/ReservationsPageClient";
import { getFilteredRooms } from "@/app/api/getRooms";
import { Room } from "@/app/types";

export const dynamic = "force-dynamic";

export default async function ReservationsPage() {
    const initialReservations = await getReservationsList({});
    const roomsResponse = await getFilteredRooms({});
    const rooms = [
        { value: undefined, label: "Wszystkie pokoje" },
        ...(roomsResponse as Room[]).map((room) => ({
            value: room.id,
            label: room.name,
        })),
    ];

    return <ReservationsPageClient initialReservations={initialReservations} rooms={rooms} />;
}

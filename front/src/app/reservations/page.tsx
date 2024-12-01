import { getFilteredRooms } from "@/app/api/getRooms";
import { getUser } from "@/app/api/getUser";
import { Reservation, Room } from "@/app/types";
import CreateReservationForm from "@/components/reservations/CreateReservationForm";
import { getReservationsList } from "../api/getReservations";
import ReservationList from "@/components/reservations/ReservationList";
import ReservationsCalendar from "@/components/reservations/ReservationsCalendar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const dynamic = "force-dynamic";

export default async function ReservationsPage() {
    const roomsResponse = await getFilteredRooms({});
    const user = await getUser(); 
    if (!user) {
        return <p>Nie udało się pobrać danych użytkownika. Spróbuj ponownie później.</p>;
    }
    const userReservationsResponse = await getReservationsList({"user_id": user.id });
    const reservations = userReservationsResponse as Reservation[];    

    const allReservationsResponse = await getReservationsList({"is_active": true});
    const allReservations = allReservationsResponse as Reservation[];
    
    const rooms = roomsResponse as Room[];
    const roomOptions = rooms.map((room) => ({
        value: room.id,
        label: room.name,
        room_data: {
            id: room.id,
            name: room.name,
            capacity: room.capacity,
            equipments: room.equipments,
        },
    }));

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Dodaj Rezerwację</h1>
            <CreateReservationForm rooms={roomOptions} user={user} />
            <Tabs defaultValue="list" className="space-y-4">
                <TabsList className="flex justify-center">
                    <TabsTrigger value="calendar">Kalendarz</TabsTrigger>
                    <TabsTrigger value="list">Moje Rezerwacje</TabsTrigger>
                </TabsList>
                
                <TabsContent value="calendar">
                    <ReservationsCalendar reservations={allReservations} />
                </TabsContent>
                <TabsContent value="list">
                    <ReservationList reservations={reservations} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

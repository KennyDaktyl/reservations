"use client";

import { useState, useEffect } from "react";
import { Reservation } from "@/app/types";
import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Select from "react-select";
import { Switch } from "@/components/ui/switch";
import { fetchReservationsAction } from "@/app/admin/reservations/actions";
import ReservationList from "../reservations/ReservationList";
import { handleRemoveReservationAction } from "@/app/reservations/actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ReservationsCalendar from "../reservations/ReservationsCalendar";
import { useSessionStore } from "@/store";
import ReservationFilterForm from "../reservations/ReservationFilterForm";
import router, { useRouter } from 'next/navigation';

interface FilterFormValues {
    date_start?: string;
    date_end?: string;
    is_active?: boolean;
    room_id?: number;
}

interface Option {
    value: number | undefined;
    label: string;
}

const ReservationsPageClient = ({
    initialReservations,
    rooms,
}: {
    initialReservations: Reservation[];
    rooms: Option[];
}) => {
    const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
    const router = useRouter();
    const role = useSessionStore((state) => state.role);
    if (role !== "admin") {
        return <p>Brak dostępu do panelu administracyjnego.</p>;
    }
    
    const { handleSubmit, control, reset } = useForm<FilterFormValues>({
        defaultValues: {
            date_start: "",
            date_end: "",
            is_active: true,
            room_id: undefined,
        },
    });

    const handleSearch = async (data: FilterFormValues) => {
        try {
            const filteredReservations = await fetchReservationsAction(data);
            setReservations(filteredReservations);
        } catch (error) {
            console.error("Error during search:", error);
        }
    };

    const handleResetFilters = async () => {
        try {
            reset(); 
            const allReservations = await fetchReservationsAction({});
            setReservations(allReservations);
        } catch (error) {
            console.error("Error resetting filters:", error);
        }
    };

    const handleDeleteReservation = async (reservationId: number) => {
        try {
            await handleRemoveReservationAction({ reservationId });
            setReservations((prevReservations) =>
                prevReservations.map((reservation) =>
                    reservation.id === reservationId
                        ? { ...reservation, is_active: false }
                        : reservation
                )
            );
        } catch (error) {
            console.error("Error deleting reservation:", error);
            alert("Nie udało się usunąć rezerwacji. Spróbuj ponownie.");
        }
    };

    return (
        <div className="space-y-6 mt-4">
            <ReservationFilterForm rooms={rooms} reservations={reservations} onSearch={handleSearch} onReset={handleResetFilters} />
            <Tabs defaultValue="list" className="space-y-4">
                <TabsList className="flex justify-center">
                    <TabsTrigger value="calendar">Kalendarz</TabsTrigger>
                    <TabsTrigger value="list">Rezerwacje</TabsTrigger>
                </TabsList>
                
                <TabsContent value="calendar">
                    <ReservationsCalendar reservations={reservations} />
                </TabsContent>
                <TabsContent value="list">
                    <ReservationList reservations={reservations} onDelete={handleDeleteReservation}/>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ReservationsPageClient;

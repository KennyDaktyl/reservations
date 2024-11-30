"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Reservation } from "@/app/types";

interface ReservationsCalendarProps {
    reservations: Reservation[];
}

const ReservationsCalendar = ({ reservations }: ReservationsCalendarProps) => {
    const activeReservations = reservations.filter(
        (reservation) => reservation.is_active && reservation.room_data
    );

    const events = activeReservations.map((reservation) => ({
        id: reservation.id.toString(),
        title: `${reservation.room_data?.name} (${reservation.user_data?.email || "Brak użytkownika"})`,
        start: reservation.start_date,
        end: reservation.end_date,
        color: "#2b6cb0", 
        textColor: "#ffffff", 
    }));

    return (
        <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            <FullCalendar
                plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                events={events}
                height="auto"
                slotMinTime="06:00:00"
                slotMaxTime="24:00:00"
                allDaySlot={false}
            />
        </div>
    );
};

export default ReservationsCalendar;

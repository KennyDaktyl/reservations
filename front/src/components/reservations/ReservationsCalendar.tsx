"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Reservation } from "@/app/types";

interface ReservationsCalendarProps {
    reservations: Reservation[];
}

const generateColor = (id: number): string => {
    const colors = [
        "#f56565", // Red
        "#ed8936", // Orange
        "#ecc94b", // Yellow
        "#48bb78", // Green
        "#4299e1", // Blue
        "#9f7aea", // Purple
        "#ed64a6", // Pink
    ];
    return colors[id % colors.length];
};

const ReservationsCalendar = ({ reservations }: ReservationsCalendarProps) => {
    const activeReservations = reservations.filter(
        (reservation) => reservation.is_active && reservation.room_data
    );

    const events = activeReservations.map((reservation) => ({
        id: reservation.id.toString(),
        title: `${reservation.room_data?.name} (${reservation.user_data?.email || "Brak użytkownika"})`,
        start: reservation.start_date,
        end: reservation.end_date,
        color: generateColor(reservation.room_id), 
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

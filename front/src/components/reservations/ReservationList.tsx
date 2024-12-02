"use client";
import { handleRemoveReservationAction } from "@/app/reservations/actions";
import { Reservation, Equipment } from "@/app/types";
import { Delete } from "lucide-react";
import { use, useEffect, useState } from "react";
import clsx from "clsx";

interface ReservationListProps {
    reservations: Reservation[];
    onDelete?: (id: number) => void; 
}

const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    };
    return new Intl.DateTimeFormat("pl-PL", options).format(new Date(date));
};

const ReservationList = ({ reservations, onDelete }: ReservationListProps) => {
    const [reservationList, setReservationList] = useState<Reservation[]>(reservations);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    useEffect(() => {
        setReservationList(reservations);
    }, [reservations]);

    const handleDeleteReservation = async (reservationId: number) => {
        setIsDeleting(reservationId);
        try {
            await handleRemoveReservationAction({ reservationId });
            setReservationList((prevReservations) =>
                prevReservations.map((reservation) =>
                    reservation.id === reservationId
                        ? { ...reservation, is_active: false }
                        : reservation
                )
            );
            if (onDelete) {
                onDelete(reservationId);
            }
        } catch (error) {
            console.error("Error deleting reservation:", error);
            alert("Nie udało się anulować rezerwacji. Spróbuj ponownie.");
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mt-6">Lista Rezerwacji</h2>
            {reservationList.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reservationList.map((reservation) => (
                        <li
                            key={reservation.id}
                            className={clsx(
                                "relative p-4 border rounded-md shadow-sm",
                                reservation.is_active ? "bg-white" : "bg-gray-100"
                            )}
                        >
                            {reservation.is_active && (
                                <button
                                    className={clsx(
                                        "absolute top-2 right-2",
                                        isDeleting === reservation.id
                                            ? "text-gray-400 cursor-not-allowed"
                                            : "text-red-500 hover:text-red-700"
                                    )}
                                    aria-label="Usuń rezerwację"
                                    onClick={() => handleDeleteReservation(reservation.id)}
                                    disabled={isDeleting === reservation.id}
                                >
                                    <Delete size={18} />
                                </button>
                            )}
                            {!reservation.is_active && (
                                <p className="mt-2 text-red-600 font-bold">
                                    Ta rezerwacja została anulowana.
                                </p>
                            )}
                            <p>
                                <strong>Pokój:</strong> {reservation.room_data?.name}
                            </p>
                            <p>
                                <strong>Użytkownik:</strong> {reservation.user_data?.email}
                            </p>
                            <p>
                                <strong>Od:</strong> {formatDate(reservation.start_date)}
                            </p>
                            <p>
                                <strong>Do:</strong> {formatDate(reservation.end_date)}
                            </p>
                            <p>
                                <strong>Status:</strong>{" "}
                                {reservation.is_active ? "Aktywna" : "Anulowana"}
                            </p>
                            {reservation.room_data?.equipments && (
                                <div className="mt-2">
                                    <strong>Wyposażenie:</strong>
                                    <ul className="list-disc list-inside">
                                        {reservation.room_data.equipments.map(
                                            (equipment: Equipment) => (
                                                <li key={equipment.id}>{equipment.name}</li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-600">Brak rezerwacji.</p>
            )}
        </div>
    );
};

export default ReservationList;

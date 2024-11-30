"use client";

import { Reservation } from "@/app/types";

interface ReservationListProps {
    reservations: Reservation[];
}

const ReservationList = ({ reservations }: ReservationListProps) => {
    return (
        <div>
            <h2 className="text-xl font-semibold mt-6">Lista Rezerwacji</h2>
            {reservations.length > 0 ? (
                <ul className="space-y-4">
                    {reservations.map((reservation) => (
                        <li
                            key={reservation.id}
                            className="p-4 border rounded-md shadow-sm bg-white"
                        >
                            <p>
                                <strong>Pokój:</strong> {reservation.room_data?.name}
                            </p>
                            <p>
                                <strong>Użytkownik:</strong> {reservation.user_data?.email}
                            </p>
                            <p>
                                <strong>Od:</strong> {reservation.start_date}
                            </p>
                            <p>
                                <strong>Do:</strong> {reservation.end_date}
                            </p>
                            <p>
                                <strong>Status:</strong>{" "}
                                {reservation.is_active ? "Aktywna" : "Anulowana"}
                            </p>
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

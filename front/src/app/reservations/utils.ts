import * as XLSX from "xlsx";
import { Reservation } from "@/app/types";

export const generateXLSX = (reservations: Reservation[]) => {
    const data = reservations.map((reservation) => ({
        ID: reservation.id,
        Room: reservation.room_data?.name || "Unknown",
        "User Email": reservation.user_data?.email || "Unknown",
        "Start Date": reservation.start_date,
        "End Date": reservation.end_date,
        "Created Date": reservation.created_date || "N/A",
        "Updated Date": reservation.updated_date || "N/A",
        "Cancelled Date": reservation.cancel_date || "N/A",
        Active: reservation.is_active ? "Yes" : "No",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reservations");

    const blob = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    return blob;
};

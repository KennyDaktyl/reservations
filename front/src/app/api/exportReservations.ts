import { fetchPostApiData } from "./fetchPostApiData";

interface ExportReservationsParams {
    [key: string]: unknown;
    date_start?: string;
    date_end?: string;
    is_active?: boolean;
    room_id?: number;
    user_id?: number;
}

export const exportReservationsToXLSX = async (filters: ExportReservationsParams): Promise<Blob> => {
    const baseUrl = process.env.NEXT_PUBLIC_RESERVATION_API_URL;

    if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_RESERVATION_API_URL is not defined");
    }

    const url = `${baseUrl}/export_reservations`;

    return await fetchPostApiData<Blob, ExportReservationsParams>({
        url,
        body: filters,
        responseType: "blob",
    });
};

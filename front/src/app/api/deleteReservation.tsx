import { fetchPostApiData } from "./fetchPostApiData";

export const deleteReservation = async (id: number): Promise<void> => {
    const url = `${process.env.NEXT_PUBLIC_RESERVATION_API_URL}/${id}`;
    try {
        await fetchPostApiData<null, { reservation_id: number }>({
            url,
            body: { reservation_id: id },
            method: "DELETE",
        });
    } catch (error) {
        console.error("Failed to remove reservation:", error);
        throw error;
    }
};

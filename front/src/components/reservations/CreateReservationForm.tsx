"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { toast } from "react-toastify";
import Select from "react-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { reservationSchema } from "@/app/schemas";
import { createReservationAction } from "@/app/reservations/actions";

type ReservationFormValues = z.infer<typeof reservationSchema>;

interface Option {
    value: number;
    label: string;
    room_data: {
        id: number;
        name: string;
        capacity: number;
        equipments: { id: number; name: string }[];
    };
}

interface ReservationsPageClientProps {
    rooms: Option[];
    user: {
        id: number;
        email: string;
        role: string;
    };
}

const CreateReservationForm = ({ rooms, user }: ReservationsPageClientProps) => {
    const {
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm<ReservationFormValues>({
        resolver: zodResolver(reservationSchema),
        defaultValues: {
            date_start: "",
            date_end: "",
            room_id: undefined,
        },
    });

    const onSubmit = async (data: ReservationFormValues) => {
        const selectedRoom = rooms.find((room) => room.value === data.room_id);
        if (!selectedRoom) {
            toast.error("Nie wybrano poprawnego pokoju.");
            return;
        }
    
        const payload = {
            start_date: data.date_start,
            end_date: data.date_end,
            room_id: selectedRoom.room_data.id,
            user_id: user.id,
            user_data: user,
            room_data: selectedRoom.room_data,
        };
    
        const response = await createReservationAction(payload);
    
        if (response.success) {
            toast.success("Rezerwacja została dodana pomyślnie!");
            reset();
        } else if (response.error) {
            const { message, details } = response.error;
    
            if (message) {
                toast.error(message);
            }
    
            if (details) {
                Object.entries(details).forEach(([key, detailMessage]) => {
                    toast.error(detailMessage as string);
                });
            }
        } else {
            toast.error("Nie udało się utworzyć rezerwacji. Spróbuj ponownie później.");
        }
    };
    
    

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-wrap gap-4 bg-gray-50 p-4 rounded-lg shadow-md items-start z-50"
        >
            <div className="flex flex-col w-1/4">
                <Label htmlFor="date_start" className="text-sm font-medium text-gray-700">
                    Data i godzina początkowa
                </Label>
                <Controller
                    name="date_start"
                    control={control}
                    render={({ field }) => (
                        <>
                            <Input
                                {...field}
                                type="datetime-local"
                                id="date_start"
                                className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.date_start && (
                                <span className="text-red-600 text-sm">
                                    {errors.date_start.message}
                                </span>
                            )}
                        </>
                    )}
                />
            </div>

            <div className="flex flex-col w-1/4">
                <Label htmlFor="date_end" className="text-sm font-medium text-gray-700">
                    Data i godzina końcowa
                </Label>
                <Controller
                    name="date_end"
                    control={control}
                    render={({ field }) => (
                        <>
                            <Input
                                {...field}
                                type="datetime-local"
                                id="date_end"
                                className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.date_end && (
                                <span className="text-red-600 text-sm">
                                    {errors.date_end.message}
                                </span>
                            )}
                        </>
                    )}
                />
            </div>

            <div className="flex flex-col w-1/4">
                <Label htmlFor="room_id" className="text-sm font-medium text-gray-700">
                    Pokój
                </Label>
                <Controller
                    name="room_id"
                    control={control}
                    render={({ field }) => (
                        <>
                            <Select<Option>
                                {...field}
                                options={rooms}
                                isSearchable
                                className="react-select-container z-auto"
                                classNamePrefix="react-select"
                                onChange={(selected) => field.onChange(selected?.value ?? undefined)}
                                value={rooms.find((room) => room.value === field.value) || null}
                            />
                            {errors.room_id && (
                                <span className="text-red-600 text-sm">
                                    {errors.room_id.message}
                                </span>
                            )}
                        </>
                    )}
                />
            </div>
            <Button type="submit" className="px-6 py-2 rounded-md ml-auto">
                Dodaj Rezerwację
            </Button>
        </form>
    );
};

export default CreateReservationForm;

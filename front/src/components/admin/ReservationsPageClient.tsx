"use client";

import { useState } from "react";
import { Reservation } from "@/app/types";
import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Select from "react-select";
import { Switch } from "@/components/ui/switch";
import { fetchReservationsAction } from "@/app/admin/reservations/actions";
import { toast } from "react-toastify";
import ReservationList from "../reservations/ReservationList";

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
    const { handleSubmit, control } = useForm<FilterFormValues>({
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
    
    
    const handleError = (errors: any) => {
        console.error("Validation errors:", errors);
    };
    

    return (
        <div className="space-y-6 mt-4">
            <form
                onSubmit={handleSubmit(handleSearch, handleError)}
                noValidate
                className="flex flex-wrap items-center gap-4 bg-gray-50 p-4 rounded-lg shadow-md h-auto"
            >
                <div className="flex flex-col w-1/4">
                    <Label htmlFor="date_start" className="text-sm font-medium text-gray-700">
                        Data i godzina początkowa
                    </Label>
                    <Controller
                        name="date_start"
                        control={control}
                        render={({ field, fieldState }) => (
                            <>
                                <Input
                                    {...field}
                                    type="datetime-local"
                                    id="date_start"
                                    placeholder="Wybierz datę i godzinę"
                                    className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                                {fieldState.error && (
                                    <span className="text-red-600 text-sm">
                                        {fieldState.error.message}
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
                        render={({ field, fieldState }) => (
                            <>
                                <Input
                                    {...field}
                                    type="datetime-local"
                                    id="date_end"
                                    placeholder="Wybierz datę i godzinę"
                                    className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                                {fieldState.error && (
                                    <span className="text-red-600 text-sm">
                                        {fieldState.error.message}
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
                        render={({ field, fieldState }) => (
                            <Select<Option>
                                {...field}
                                options={rooms}
                                isSearchable
                                className="react-select-container"
                                classNamePrefix="react-select"
                                value={rooms.find((room) => room.value === field.value) || null}
                                onChange={(selected) => field.onChange(selected ? selected.value : undefined)}
                            />
                        )}
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Controller
                        name="is_active"
                        control={control}
                        render={({ field }) => (
                            <>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    id="is_active"
                                    className="bg-blue-600 data-[state=unchecked]:bg-gray-300"
                                />
                                <Label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                                    Aktywne
                                </Label>
                            </>
                        )}
                    />
                </div>
                <Button type="submit" className="px-6 py-2 rounded-md">
                    Szukaj
                </Button>
            </form>

            <ReservationList reservations={reservations} />
        </div>
    );
};

export default ReservationsPageClient;

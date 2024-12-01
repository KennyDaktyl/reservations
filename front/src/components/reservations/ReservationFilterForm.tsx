"use client";

import { Controller, useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Select from "react-select";
import { Switch } from "@/components/ui/switch";
import { Reservation } from "@/app/types";
import { generateXLSX } from "@/app/reservations/utils";

export interface FilterFormValues {
    date_start?: string;
    date_end?: string;
    is_active?: boolean;
    room_id?: number;
}

interface Option {
    value: number | undefined;
    label: string;
}

interface ReservationFilterFormProps {
    rooms: Option[];
    reservations: Reservation[]; // Dane rezerwacji przekazywane do komponentu
    onSearch: (data: FilterFormValues) => void;
    onReset: () => void;
}

const ReservationFilterForm = ({ rooms, reservations, onSearch, onReset }: ReservationFilterFormProps) => {
    const { handleSubmit, control, reset, getValues } = useForm<FilterFormValues>({
        defaultValues: {
            date_start: "",
            date_end: "",
            is_active: true,
            room_id: undefined,
        },
    });

    const handleFormSubmit = (data: FilterFormValues) => {
        onSearch(data);
    };

    const handleFormReset = () => {
        reset();
        onReset();
    };

    const handleGenerateXLSX = () => {
        try {
            const blob = generateXLSX(reservations);

            const url = window.URL.createObjectURL(
                new Blob([blob], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
            );
            const link = document.createElement("a");
            link.href = url;
            link.download = "reservations.xlsx"; // Nazwa pliku
            link.click();
            URL.revokeObjectURL(url); // Zwolnienie pamięci
        } catch (error) {
            console.error("Failed to generate XLSX:", error);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
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
                    render={({ field }) => (
                        <Input
                            {...field}
                            type="datetime-local"
                            id="date_start"
                            placeholder="Wybierz datę i godzinę"
                            className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
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
                        <Input
                            {...field}
                            type="datetime-local"
                            id="date_end"
                            placeholder="Wybierz datę i godzinę"
                            className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
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
            <Button type="button" onClick={handleFormReset} className="px-6 py-2 rounded-md">
                Resetuj filtry
            </Button>
            <Button type="button" onClick={handleGenerateXLSX} className="px-6 py-2 rounded-md">
                Pobierz XLSX
            </Button>
        </form>
    );
};

export default ReservationFilterForm;

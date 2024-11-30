"use client";

import { useState } from "react";
import { Room } from "@/app/types";
import RoomList from "../admin/RoomList";
import { fetchFilteredRoomsAction } from "@/app/rooms/actions";
import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import { Input } from "../ui/input";

interface RoomsPageClientProps {
    rooms: Room[];
    equipments: { value: number; label: string }[];
}

interface FilterFormValues {
    minCapacity?: number;
    maxCapacity?: number;
    equipments: { value: number; label: string }[];
}

const RoomsPageClient = ({ rooms: initialRooms, equipments }: RoomsPageClientProps) => {
    const [rooms, setRooms] = useState<Room[]>(initialRooms);
    const { handleSubmit, control, register } = useForm<FilterFormValues>({
        defaultValues: {
            minCapacity: undefined,
            maxCapacity: undefined,
            equipments: [],
        },
    });

    const handleSearch = async (data: FilterFormValues) => {
        const filters = {
            minCapacity: data.minCapacity,
            maxCapacity: data.maxCapacity,
            equipmentIds: data.equipments.map((eq) => eq.value),
        };

        const filteredRooms = await fetchFilteredRoomsAction(filters);
        if (Array.isArray(filteredRooms)) {
            setRooms(filteredRooms);
        } else {
            console.error("Error fetching filtered rooms:", filteredRooms);
        }
    };

    return (
        <div className="space-y-6 mt-4">
            <form
                onSubmit={handleSubmit(handleSearch)}
                className="flex flex-wrap items-center gap-4 bg-gray-50 p-4 rounded-lg shadow-md h-24"
            >
                <div className="flex flex-col w-1/4">
                    <Label htmlFor="minCapacity" className="text-sm font-medium text-gray-700">
                        Min Pojemność
                    </Label>
                    <Input
                        {...register("minCapacity", { valueAsNumber: true })}
                        type="number"
                        id="minCapacity"
                        placeholder="np. 10"
                        className="input border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="flex flex-col w-1/4">
                    <Label htmlFor="maxCapacity" className="text-sm font-medium text-gray-700">
                        Max Pojemność
                    </Label>
                    <Input
                        {...register("maxCapacity", { valueAsNumber: true })}
                        type="number"
                        id="maxCapacity"
                        placeholder="np. 100"
                        className="input border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="flex flex-col flex-1">
                    <Label htmlFor="equipments" className="text-sm font-medium text-gray-700">
                        Wyposażenie
                    </Label>
                    <Controller
                        control={control}
                        name="equipments"
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={equipments}
                                isMulti
                                className="react-select-container"
                                classNamePrefix="react-select"
                                onChange={(selected) => field.onChange(selected || [])}
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        borderColor: "#d1d5db",
                                        borderRadius: "0.375rem",
                                        boxShadow: "none",
                                        "&:hover": {
                                            borderColor: "#2563eb",
                                        },
                                    }),
                                }}
                            />
                        )}
                    />
                </div>
                <Button type="submit" className="px-6 py-2 rounded-md">
                    Szukaj
                </Button>
            </form>

            <RoomList rooms={rooms} />
        </div>
    );
};

export default RoomsPageClient;

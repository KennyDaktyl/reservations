"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { EquipmentSchema, FormData } from "@/app/schemas";

interface EquipmentModalProps {
    onSubmit: (data: FormData) => void; 
}

const EquipmentModal = ({ onSubmit }: EquipmentModalProps) => {
    const [open, setOpen] = useState(false);

    const {
        handleSubmit,
        control,
        register,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(EquipmentSchema),
    });

    const handleFormSubmit: SubmitHandler<FormData> = (data) => {
        onSubmit(data); 
        reset();
        setOpen(false); 
    };

    return (
        <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
            <DialogPrimitive.Trigger asChild>
                <Button>Dodaj nowe wyposażenie</Button>
            </DialogPrimitive.Trigger>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 z-40" />
                <DialogPrimitive.Content
                    className="fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg focus:outline-none"
                >
                    <DialogHeader>
                        <DialogPrimitive.Title className="text-xl font-semibold">Dodaj nowe wyposażenie</DialogPrimitive.Title>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
                        <div>
                            <Label htmlFor="name">Nazwa pokoju</Label>
                            <Input
                                id="name"
                                {...register("name")}
                                className={errors.name ? "border-red-500" : ""}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name.message?.toString()}</p>
                            )}
                        </div>
                        <Button type="submit" className="w-full bg-green-600">
                            Zapisz
                        </Button>
                    </form>
                    <DialogPrimitive.Close
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        ✕
                    </DialogPrimitive.Close>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
};

export default EquipmentModal;

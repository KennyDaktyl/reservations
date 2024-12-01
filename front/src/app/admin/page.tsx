"use client";
import { useSessionStore } from "@/store";

export const dynamic = "force-dynamic";

export default function AdminPage() {

    const role = useSessionStore((state) => state.role);

    if (role !== "admin") {
        return <p>Brak dostępu do panelu administracyjnego.</p>;
    }
    return (
        <div>
            <h1>Panel Admina</h1>
            <p>Witaj w panelu admina. Wybierz opcję z menu.</p>
        </div>
    );
}

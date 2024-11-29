import { getEquipmentsList } from "@/app/api/getEquipments";
import { Equipment } from "@/app/types";
import EquipmentPageClient from "@/components/admin/EquipmentPageClient";

export const dynamic = "force-dynamic";

export default async function EquipmentsPage() {
    const equipments = await getEquipmentsList();
    return (
        <EquipmentPageClient equipments={equipments as Equipment[]} />
    );
}

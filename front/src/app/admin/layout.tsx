import Navbar from "@/components/admin/Navbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="admin-container mt-2 mx-2">{children}</main>
        </>
    );
}

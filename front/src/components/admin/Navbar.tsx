import { ActiveLink } from "../atoms/ActiveLink";

export default function Navbar() {
    return (
        <nav className="shadow-md mb-4">
            <div className="container mx-auto p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Admin Panel</h1>
                <div className="flex space-x-4">
                    <ActiveLink role="link" href="/admin/rooms" className="hover:text-dark-500">
                        Pokoje
                    </ActiveLink>
                    <ActiveLink role="link" href="/admin/equipments" className="hover:text-dark-500">
                        Wyposażenie
                    </ActiveLink>
                </div>
            </div>
        </nav>
    );
}

import { ActiveLink } from "../atoms/ActiveLink";

export default function Navbar() {
    return (
        <nav className="shadow-md">
            <div className="flex flex-wrap items-center gap-4 bg-gray-50 p-4 rounded-lg shadow-md  mb-4 mt-4  h-24">
                <h1 className="text-md font-bold">Admin Panel</h1>
                <div className="flex space-x-4 ml-auto">
                    <ActiveLink role="link" href="/admin/reservations" className="hover:text-dark-500">
                        Rezerwacje
                    </ActiveLink>
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

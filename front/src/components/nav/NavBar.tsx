"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ActiveLink } from "../atoms/ActiveLink";
import { Button } from "../ui/button";

type NavLink = {
    href: string;
    label: string;
    exact: boolean;
    requiresAuth?: boolean;
    isAdmin?: boolean;
};

const NavLinks: NavLink[] = [
    { href: "/auth/login", label: "Zaloguj", exact: true },
    { href: "/auth/register", label: "Zarejestruj", exact: true },
    { href: "/reservations", label: "Rezerwacje", exact: true, requiresAuth: true },
    { href: "/rooms", label: "Pokoje", exact: true, requiresAuth: true },
    { href: "/admin", label: "Admin", exact: true, requiresAuth: true, isAdmin: true },
];

export default function NavBar() {
    const { data: session, status } = useSession();
    const [role, setRole] = useState<"guest" | "user" | "admin">("guest");
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            setRole(session.user.role as "user" | "admin" | "guest");
        } else if (status === "unauthenticated") {
            setRole("guest");
        }
		console.log("Role:", role);
		console.log("Session:", session);
    }, [session, status]);

    const handleLogout = async () => {
        await signOut({ redirect: false });
        setRole("guest");
        router.push("/");
    };

    const filteredLinks = NavLinks.filter((link) => {
        if (link.requiresAuth && role === "guest") return false; 
        if (link.isAdmin && role !== "admin") return false; 
        if (!link.requiresAuth && role !== "guest") return false; 
        return true;
    });

    return (
        <nav className="fixed top-0 z-50 w-full bg-white shadow-md">
            <div className="mx-auto flex h-24 max-w-screen-xl items-center justify-between p-5">
                <ul className="ml-4 flex h-24 items-center space-x-4">
                    {filteredLinks.map((link) => (
                        <li key={link.href}>
                            <ActiveLink role="link" href={link.href} exact={link.exact}>
                                {link.label}
                            </ActiveLink>
                        </li>
                    ))}
                    {role !== "guest" && (
                        <li>
                            <Button onClick={handleLogout}>Wyloguj</Button>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}

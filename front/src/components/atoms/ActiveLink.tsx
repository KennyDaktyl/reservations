"use client";

import type { UrlObject } from "url";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface ActiveLinkProps {
	href: string | UrlObject;
	role: string;
	children: ReactNode;
	className?: string; // Dodano argument className
	exact?: boolean;
}

export const ActiveLink = ({ href, role, children, exact = false, className }: ActiveLinkProps) => {
	const pathname = usePathname();
	const resolvedHref = typeof href === "string" ? { pathname: href } : href;
	let isActive = pathname === resolvedHref.pathname;

	if (!exact && resolvedHref.pathname) {
		isActive = pathname.startsWith(resolvedHref.pathname);
	}

	return (
		<Link
			href={resolvedHref}
			role={role}
			className={clsx(
				className,
				!isActive && "font-small text-md sm:text-md lg:text-md text-gray-500 hover:text-gray-900",
				isActive && "text-gray-900",
			)}
			aria-current={isActive ? "page" : undefined}
		>
			{children}
		</Link>
	);
};

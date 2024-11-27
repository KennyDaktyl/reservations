"use client";

import { Header } from "./header";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { BackButton } from "../ui/back-button";

interface CardWrapperProps {
	children: React.ReactNode;
	headerLabel: string;
	backButtonLabel: string;
	backButtonHref: string;
	showSocials: boolean;
}

export const CardWrapperRegister = ({
	children,
	headerLabel,
	backButtonLabel,
	backButtonHref,
}: CardWrapperProps) => {
	return (
		<Card className="w-[400px] border-emerald-50 bg-slate-100 shadow-xl">
			<CardHeader>
				<Header label={headerLabel} />
			</CardHeader>
			<CardContent>{children}</CardContent>
			<CardFooter>
				<BackButton label={backButtonLabel} href={backButtonHref} />
			</CardFooter>
		</Card>
	);
};

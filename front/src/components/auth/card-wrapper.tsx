"use client";

import { Header } from "@/components/auth/header";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { BackButton } from "../ui/back-button";

interface CardWrapperProps {
	children: React.ReactNode;
	headerLabel: string;
	backButtonLabel: string;
	backButtonHref: string;
	forgotButtonLabel: string;
	forgotButtonHref: string;
	showSocials: boolean;
}

export const CardWrapper = ({
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

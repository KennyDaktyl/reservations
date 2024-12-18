import NavBar from "@/components/nav/NavBar";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { NextAuthProvider } from "@/components/auth/next-auth-provider";
import { ToastContainer } from "react-toastify";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body cz-shortcut-listen="false">
				<NextAuthProvider>
					<NavBar />
				</NextAuthProvider>
				<main className="mx-auto mt-24 min-h-screen max-w-screen-xl overflow-hidden pl-5 pr-5 xl:pl-0 xl:pr-0">
					{children}
				</main>
				<ToastContainer />
			</body>
		</html>
	);
}

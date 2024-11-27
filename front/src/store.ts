import { create } from "zustand";

type SessionState = {
	role: "guest" | "user" | "admin";
	setRole: (role: "guest" | "user" | "admin") => void;
};

export const useSessionStore = create<SessionState>((set) => ({
	role: "guest",
	setRole: (role) => set({ role }),
}));

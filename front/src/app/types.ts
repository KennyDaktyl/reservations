export interface ResponseData {
    id?: string;
    email?: string;
    role?: "user" | "admin";
  }
  
export type UserRole = "guest" | "user" | "admin";

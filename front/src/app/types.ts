export interface ResponseData {
    id?: string;
    email?: string;
    role?: "user" | "admin";
  }
  
export type UserRole = "guest" | "user" | "admin";

export interface Equipment {
  id: number;
  name: string;
}

export interface EquipmentInput {
  name: string;
}

export interface EquipmentInput extends Record<string, unknown> {
  name: string;
}

export interface Room {
  id: number;
  name: string;
  capacity: number;
  equipments: Equipment[];
}

export interface Room extends Record<string, unknown> {
  id: number;
  name: string;
  capacity: number;
  equipments: Equipment[];
}

export interface RoomInput {
  name: string;
  capacity: number;
  equipments?: number[];
}

export interface RoomInput extends Record<string, unknown> {
  name: string;
  capacity: number;
  equipments?: number[];
}

export interface Reservation {
  id: number;
  room_id: number;
  user_id: number;
  start_date: string;
  end_date: string;   
  created_date?: string;
  updated_date?: string;
  cancel_date?: string | null;
  is_active: boolean; 
  room_data?: Room;
  user_data?: UserData
}

export interface UserData {
  id: number;
  email: string;
  role: string;
}

export interface RoomOption {
  value: number;
  label: string;
}

export interface FormValues {
  start_date: string;
  end_date: string;
  room_id?: number;
  user_id?: number;
}

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

export type ObjectType = 'table-rect' | 'table-round' | 'table-square' | 'booth' | 'wall' | 'plant' | 'bar' | 'door' | 'window';

export interface FloorObject {
  id: string;
  type: ObjectType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  seats?: number;
  label?: string;
  shape?: 'rectangle' | 'circle' | 'custom';
}

export interface Room {
  id: string;
  name: string;
  width: number;
  height: number;
  objects: FloorObject[];
}

export interface Reservation {
  id: string;
  tableId: string; // which table
  guestName: string;
  guestCount: number;
  startTime: string; // ISO string or "HH:mm"
  duration: number; // minutes
  status: 'confirmed' | 'seated' | 'finished' | 'cancelled';
  notes?: string;
}

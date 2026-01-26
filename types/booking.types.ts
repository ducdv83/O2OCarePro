export type BookingStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'DISPUTED'
  | 'CANCELLED';

export interface Booking {
  id: string;
  jobId: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  agreedRate: number;
  startTime: Date;
  endTime: Date;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  status: BookingStatus;
  createdAt: Date;
  timesheet?: {
    checkinAt?: Date;
    checkoutAt?: Date;
    hours?: number;
    clientConfirmed: boolean;
  };
}

export interface Job {
  id: string;
  serviceType: string;
  description: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  startTime: Date;
  endTime: Date;
  budgetMin: number;
  budgetMax: number;
  status: 'DRAFT' | 'OPEN' | 'BOOKED' | 'DONE' | 'CANCELLED';
  createdAt: Date;
  distance?: number; // km
  fitScore?: number; // 0-100
}


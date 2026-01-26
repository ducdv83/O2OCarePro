import apiClient from './client';

export interface CheckInRequest {
  lat: number;
  lng: number;
}

export interface CheckOutRequest {
  lat: number;
  lng: number;
  note?: string;
}

export interface Timesheet {
  id: string;
  booking_id: string;
  checkin_at?: string;
  checkout_at?: string;
  hours?: number;
  client_confirmed: boolean;
}

export const timesheetsApi = {
  checkIn: async (bookingId: string, data: CheckInRequest): Promise<Timesheet> => {
    const response = await apiClient.post<Timesheet>(
      `/bookings/${bookingId}/timesheet/checkin`,
      data
    );
    return response.data;
  },

  checkOut: async (bookingId: string, data: CheckOutRequest): Promise<Timesheet> => {
    const response = await apiClient.post<Timesheet>(
      `/bookings/${bookingId}/timesheet/checkout`,
      data
    );
    return response.data;
  },

  getOne: async (bookingId: string): Promise<Timesheet> => {
    const response = await apiClient.get<Timesheet>(`/bookings/${bookingId}/timesheet`);
    return response.data;
  },
};


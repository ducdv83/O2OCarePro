import apiClient from './client';
import { Booking } from '../../types/booking.types';

export const bookingsApi = {
  findAll: async (params?: { status?: string }): Promise<Booking[]> => {
    const response = await apiClient.get<Booking[]>('/bookings', { params });
    return response.data;
  },

  findOne: async (id: string): Promise<Booking> => {
    const response = await apiClient.get<Booking>(`/bookings/${id}`);
    return response.data;
  },

  start: async (id: string): Promise<Booking> => {
    const response = await apiClient.put<Booking>(`/bookings/${id}/start`);
    return response.data;
  },

  complete: async (id: string): Promise<Booking> => {
    const response = await apiClient.put<Booking>(`/bookings/${id}/complete`);
    return response.data;
  },

  cancel: async (id: string, reason?: string): Promise<Booking> => {
    const response = await apiClient.put<Booking>(`/bookings/${id}/cancel`, { reason });
    return response.data;
  },
};


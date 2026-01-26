import apiClient from './client';
import { Job } from '../../types/booking.types';

export const jobsApi = {
  findNearby: async (lat: number, lng: number, radius?: number): Promise<Job[]> => {
    const response = await apiClient.get<Job[]>('/jobs/nearby', {
      params: { lat, lng, radius },
    });
    return response.data;
  },

  findAll: async (params?: {
    status?: string;
    service_type?: string;
    search?: string;
  }): Promise<Job[]> => {
    const response = await apiClient.get<Job[]>('/jobs', { params });
    return response.data;
  },

  findOne: async (id: string): Promise<Job> => {
    const response = await apiClient.get<Job>(`/jobs/${id}`);
    return response.data;
  },
};


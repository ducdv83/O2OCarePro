import apiClient from './client';
import { Job } from '../../types/booking.types';

export const jobsApi = {
  findNearby: async (lat: number, lng: number, radius?: number): Promise<Job[]> => {
    const response = await apiClient.get<Job[] | { data?: Job[]; jobs?: Job[] }>('/jobs/nearby', {
      params: { lat, lng, radius },
    });
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray((data as any).data)) return (data as any).data;
    if (data && Array.isArray((data as any).jobs)) return (data as any).jobs;
    return [];
  },

  findAll: async (params?: {
    status?: string;
    service_type?: string;
    search?: string;
  }): Promise<Job[]> => {
    const response = await apiClient.get<Job[]>('/jobs', { params });
    return response.data;
  },

  findOne: async (id: string): Promise<any> => {
    const response = await apiClient.get<{ data?: any } | any>(`/jobs/${id}`);
    const body = response.data;
    // Backend wrap: { data: job, timestamp }
    if (body && typeof body === 'object' && 'data' in body && body.data != null) {
      return body.data;
    }
    return body;
  },
};


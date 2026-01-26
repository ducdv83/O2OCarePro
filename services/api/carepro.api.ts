import apiClient from './client';

export interface CreateCareproRequest {
  bio?: string;
  years_exp?: number;
  skills?: string[];
  service_types?: string[];
  hourly_rate_hint?: number;
}

export interface UpdateCareproRequest {
  bio?: string;
  years_exp?: number;
  skills?: string[];
  service_types?: string[];
  hourly_rate_hint?: number;
}

export interface CareproProfile {
  user_id: string;
  bio?: string;
  years_exp: number;
  skills: string[];
  service_types: string[];
  hourly_rate_hint?: number;
  verified_level: number;
  rating_avg: number;
  rating_count: number;
}

export const careproApi = {
  create: async (data: CreateCareproRequest): Promise<CareproProfile> => {
    const response = await apiClient.post<CareproProfile>('/carepros', data);
    return response.data;
  },

  getMe: async (): Promise<CareproProfile> => {
    const response = await apiClient.get<CareproProfile>('/carepros/me');
    return response.data;
  },

  update: async (data: UpdateCareproRequest): Promise<CareproProfile> => {
    const response = await apiClient.put<CareproProfile>('/carepros/me', data);
    return response.data;
  },

  findOne: async (userId: string): Promise<CareproProfile> => {
    const response = await apiClient.get<CareproProfile>(`/carepros/${userId}`);
    return response.data;
  },
};


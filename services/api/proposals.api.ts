import apiClient from './client';

export interface CreateProposalRequest {
  job_id: string;
  proposed_rate: number;
  message?: string;
}

export interface Proposal {
  id: string;
  job_id: string;
  carepro_id: string;
  proposed_rate: number;
  message?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  created_at: string;
}

export const proposalsApi = {
  create: async (data: CreateProposalRequest): Promise<Proposal> => {
    const response = await apiClient.post<Proposal>('/proposals', data);
    return response.data;
  },

  findAll: async (params?: { job_id?: string; carepro_id?: string }): Promise<Proposal[]> => {
    const response = await apiClient.get<Proposal[]>('/proposals', { params });
    return response.data;
  },

  findOne: async (id: string): Promise<Proposal> => {
    const response = await apiClient.get<Proposal>(`/proposals/${id}`);
    return response.data;
  },
};


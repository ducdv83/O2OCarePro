import apiClient from './client';
import { Job } from '../../types/booking.types';

export interface FitScoreResult {
  job: Job;
  fitScore: number;
  breakdown: {
    skills: number;
    timeDistance: number;
    experience: number;
    rating: number;
    price: number;
  };
}

export const matchingApi = {
  getMatchedJobs: async (limit: number = 20): Promise<FitScoreResult[]> => {
    const response = await apiClient.get<FitScoreResult[]>('/matching/carepros/me/jobs', {
      params: { limit },
    });
    return response.data;
  },
};


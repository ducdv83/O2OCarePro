import apiClient from './client';

export interface RequestOtpRequest {
  phone: string;
}

export interface RequestOtpResponse {
  request_id: string;
}

export interface VerifyOtpRequest {
  request_id: string;
  otp: string;
  role?: 'CLIENT' | 'CAREPRO';
}

export interface VerifyOtpResponse {
  token: string;
  user: {
    id: string;
    phone: string;
    role: string;
    full_name?: string;
    email?: string;
  };
}

export const authApi = {
  requestOtp: async (phone: string): Promise<RequestOtpResponse> => {
    const response = await apiClient.post<RequestOtpResponse>('/auth/request-otp', {
      phone,
    });
    return response.data;
  },

  verifyOtp: async (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
    const response = await apiClient.post<VerifyOtpResponse>('/auth/verify-otp', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getMe: async (): Promise<any> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};


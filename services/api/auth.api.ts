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

export interface CheckPhoneResponse {
  exists: boolean;
}

export interface RegisterLoginResponse {
  token: string;
  user: {
    id: string;
    phone: string;
    role: string;
    full_name?: string;
    email?: string;
  };
}

export interface RegisterParams {
  phone: string;
  password: string;
  full_name: string;
  email?: string;
  gender?: string;
  address?: string;
}

export const authApi = {
  /** Đăng ký CarePro (số điện thoại + mật khẩu + thông tin cá nhân). */
  register: async (params: RegisterParams): Promise<RegisterLoginResponse> => {
    const response = await apiClient.post<{ data: RegisterLoginResponse }>('/auth/register', {
      phone: params.phone,
      password: params.password,
      full_name: params.full_name,
      email: params.email || undefined,
      gender: params.gender || undefined,
      address: params.address || undefined,
    });
    return response.data.data;
  },

  /** Đăng nhập (số điện thoại + mật khẩu). */
  login: async (phone: string, password: string): Promise<RegisterLoginResponse> => {
    const response = await apiClient.post<{ data: RegisterLoginResponse }>('/auth/login', {
      phone,
      password,
    });
    return response.data.data;
  },

  /** Kiểm tra SĐT đã đăng ký (dùng trước khi gửi OTP đăng ký CarePro). */
  checkPhoneExists: async (phone: string): Promise<CheckPhoneResponse> => {
    const response = await apiClient.post<{ data: CheckPhoneResponse }>('/auth/check-phone', {
      phone,
    });
    return response.data.data;
  },

  requestOtp: async (phone: string): Promise<RequestOtpResponse> => {
    const response = await apiClient.post<{ data: RequestOtpResponse }>('/auth/request-otp', {
      phone,
    });
    return response.data.data;
  },

  verifyOtp: async (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
    const response = await apiClient.post<{ data: VerifyOtpResponse }>('/auth/verify-otp', data);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getMe: async (): Promise<any> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};


import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import OTPInput from '../../components/auth/OTPInput';
import { useAuthStore } from '../../store/auth.store';
import { authApi } from '../../services/api/auth.api';

export default function VerifyOTPScreen() {
  const { phone, type, requestId } = useLocalSearchParams<{
    phone: string;
    type: 'login' | 'register';
    requestId?: string;
  }>();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(requestId || null);
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // [DEV] Bypass OTP: nhập 123456 hoặc bấm nút bên dưới để vào app không gọi API
  const DEV_OTP_BYPASS = '123456';

  const handleVerifyOTP = async (enteredOtp: string) => {
    if (enteredOtp === DEV_OTP_BYPASS) {
      setToken('dev-bypass-token');
      setUser({
        id: 'dev-user-id',
        phone: phone || '',
        role: type === 'register' ? 'CAREPRO' : 'CAREPRO',
        fullName: 'CarePro (Dev)',
      });
      if (type === 'register') {
        router.replace('/(auth)/complete-profile');
      } else {
        router.replace('/(tabs)');
      }
      return;
    }

    if (!currentRequestId) {
      Alert.alert('Lỗi', 'Không tìm thấy request ID. Vui lòng gửi lại mã OTP.');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.verifyOtp({
        request_id: currentRequestId,
        otp: enteredOtp,
        role: type === 'register' ? 'CAREPRO' : undefined,
      });

      setToken(response.token);
      setUser({
        id: response.user.id,
        phone: response.user.phone,
        role: response.user.role,
        fullName: response.user.full_name,
      });

      if (type === 'register') {
        router.replace('/(auth)/complete-profile');
      } else {
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Mã OTP không đúng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!phone) {
      Alert.alert('Lỗi', 'Không tìm thấy số điện thoại');
      return;
    }

    try {
      const response = await authApi.requestOtp(phone);
      setCurrentRequestId(response.request_id);
      setCountdown(60);
      setCanResend(false);
      Alert.alert('Thành công', 'Mã OTP mới đã được gửi');
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể gửi lại mã OTP');
    }
  };

  return (
    <View className="flex-1 bg-white px-6">
      <StatusBar style="dark" />
      
      <View className="flex-1 justify-center">
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Xác thực OTP
        </Text>
        <Text className="text-base text-gray-600 mb-2">
          Mã OTP đã được gửi đến
        </Text>
        <Text className="text-base font-semibold text-gray-900 mb-8">
          {phone}
        </Text>

        <View className="mb-6">
          <OTPInput length={6} onComplete={handleVerifyOTP} />
        </View>

        <View className="items-center gap-4">
          {!canResend ? (
            <Text className="text-gray-500">
              Gửi lại mã sau {countdown}s
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResendOTP}>
              <Text className="text-blue-500 font-semibold">
                Gửi lại mã OTP
              </Text>
            </TouchableOpacity>
          )}
          {/* [DEV] Bỏ qua verify — xóa khi ship */}
          <TouchableOpacity
            onPress={() => handleVerifyOTP(DEV_OTP_BYPASS)}
            className="mt-2 px-4 py-2 bg-amber-100 rounded-lg"
          >
            <Text className="text-amber-800 text-sm font-medium">
              Dev: Vào app (OTP 123456)
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="mt-8"
          onPress={() => router.back()}
        >
          <Text className="text-center text-blue-500">
            Quay lại
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


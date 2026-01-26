import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { authApi } from '../../services/api/auth.api';

export default function RegisterScreen() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại hợp lệ');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.requestOtp(phone);
      router.push({
        pathname: '/(auth)/verify-otp',
        params: { phone, type: 'register', requestId: response.request_id },
      });
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể gửi mã OTP. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-6">
      <StatusBar style="dark" />
      
      <View className="flex-1 justify-center">
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Tạo tài khoản CarePro
        </Text>
        <Text className="text-base text-gray-600 mb-8">
          Nhập số điện thoại để bắt đầu đăng ký
        </Text>

        <View className="mb-6">
          <Text className="text-sm text-gray-700 mb-2">Số điện thoại</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
            placeholder="0901234567"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoFocus
          />
        </View>

        <TouchableOpacity
          className={`bg-blue-500 py-4 rounded-lg items-center ${loading ? 'opacity-50' : ''}`}
          onPress={handleSendOTP}
          disabled={loading}
        >
          <Text className="text-white text-lg font-semibold">
            {loading ? 'Đang gửi...' : 'Tiếp tục'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-4"
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


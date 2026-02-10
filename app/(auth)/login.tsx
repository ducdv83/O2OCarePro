import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { authApi } from '../../services/api/auth.api';
import { useAuthStore } from '../../store/auth.store';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);

  const handleLogin = async () => {
    setErrorMessage('');
    if (!phone || phone.length < 10) {
      setErrorMessage('Vui lòng nhập số điện thoại hợp lệ');
      return;
    }
    if (!password) {
      setErrorMessage('Vui lòng nhập mật khẩu');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.login(phone, password);
      setToken(response.token);
      setUser({
        id: response.user.id,
        phone: response.user.phone,
        role: response.user.role,
        fullName: response.user.full_name,
      });
      router.replace('/(tabs)');
    } catch (error: any) {
      const msg = Array.isArray(error?.message) ? error.message[0] : error?.message;
      setErrorMessage(msg || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-6">
      <StatusBar style="dark" />

      <View className="flex-1 justify-center">
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Đăng nhập
        </Text>
        <Text className="text-base text-gray-600 mb-8">
          Nhập số điện thoại và mật khẩu
        </Text>

        <View className="mb-4">
          <Text className="text-sm text-gray-700 mb-2">Số điện thoại (tên đăng nhập)</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
            placeholder="0901234567"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              setErrorMessage('');
            }}
            keyboardType="phone-pad"
            autoFocus
          />
        </View>

        <View className="mb-6">
          <Text className="text-sm text-gray-700 mb-2">Mật khẩu</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
            placeholder="Mật khẩu"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrorMessage('');
            }}
            secureTextEntry
          />
        </View>

        {errorMessage ? (
          <Text className="text-red-500 text-sm mb-4">{errorMessage}</Text>
        ) : null}

        <TouchableOpacity
          className={`bg-blue-500 py-4 rounded-lg items-center ${loading ? 'opacity-50' : ''}`}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className="text-white text-lg font-semibold">
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
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

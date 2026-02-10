import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { authApi } from '../../services/api/auth.api';
import { useAuthStore } from '../../store/auth.store';

const GENDER_OPTIONS = [
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'other', label: 'Khác' },
] as const;

export default function RegisterScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<string>('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);

  const handleRegister = async () => {
    setErrorMessage('');
    if (!phone || phone.length < 10) {
      setErrorMessage('Vui lòng nhập số điện thoại hợp lệ');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (!fullName || fullName.trim().length < 2) {
      setErrorMessage('Vui lòng nhập họ và tên (ít nhất 2 ký tự)');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.register({
        phone,
        password,
        full_name: fullName.trim(),
        email: email.trim() || undefined,
        gender: gender || undefined,
        address: address.trim() || undefined,
      });
      setToken(response.token);
      setUser({
        id: response.user.id,
        phone: response.user.phone,
        role: response.user.role,
        fullName: response.user.full_name,
      });
      router.replace('/(auth)/complete-profile');
    } catch (error: any) {
      const msg = Array.isArray(error?.message) ? error.message[0] : error?.message;
      setErrorMessage(msg || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setErrorMessage('');

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
      <View className="flex-1 px-6 py-6">
        <StatusBar style="dark" />

        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Tạo tài khoản CarePro
        </Text>
        <Text className="text-base text-gray-600 mb-6">
          Điền thông tin để đăng ký
        </Text>

        <View className="mb-4">
          <Text className="text-sm text-gray-700 mb-2">Số điện thoại (tên đăng nhập) *</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
            placeholder="0901234567"
            value={phone}
            onChangeText={(t) => { setPhone(t); clearError(); }}
            keyboardType="phone-pad"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm text-gray-700 mb-2">Mật khẩu *</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
            placeholder="Ít nhất 6 ký tự"
            value={password}
            onChangeText={(t) => { setPassword(t); clearError(); }}
            secureTextEntry
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm text-gray-700 mb-2">Họ và tên *</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
            placeholder="Nguyễn Văn A"
            value={fullName}
            onChangeText={(t) => { setFullName(t); clearError(); }}
            autoCapitalize="words"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm text-gray-700 mb-2">Email</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
            placeholder="email@example.com"
            value={email}
            onChangeText={(t) => { setEmail(t); clearError(); }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm text-gray-700 mb-2">Giới tính</Text>
          <View className="flex-row gap-2 flex-wrap">
            {GENDER_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => { setGender(opt.value); clearError(); }}
                className={`px-4 py-3 rounded-lg border ${
                  gender === opt.value ? 'bg-blue-500 border-blue-500' : 'border-gray-300 bg-white'
                }`}
              >
                <Text className={gender === opt.value ? 'text-white font-medium' : 'text-gray-700'}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-sm text-gray-700 mb-2">Địa chỉ</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
            placeholder="Số nhà, đường, quận, thành phố"
            value={address}
            onChangeText={(t) => { setAddress(t); clearError(); }}
          />
        </View>

        {errorMessage ? (
          <Text className="text-red-500 text-sm mb-4">{errorMessage}</Text>
        ) : null}

        <TouchableOpacity
          className={`bg-blue-500 py-4 rounded-lg items-center ${loading ? 'opacity-50' : ''}`}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text className="text-white text-lg font-semibold">
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="mt-4" onPress={() => router.back()}>
          <Text className="text-center text-blue-500">Quay lại</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

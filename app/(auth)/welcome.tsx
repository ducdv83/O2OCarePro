import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { colors } from '../../constants/colors';

export default function WelcomeScreen() {
  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      <StatusBar style="dark" />
      
      {/* Logo/Icon placeholder */}
      <View className="w-32 h-32 bg-blue-500 rounded-full items-center justify-center mb-8">
        <Text className="text-white text-4xl font-bold">O2O</Text>
      </View>

      <Text className="text-3xl font-bold text-gray-900 text-center mb-4">
        Chào mừng đến với{'\n'}O2O CarePro
      </Text>
      
      <Text className="text-base text-gray-600 text-center mb-12 px-4">
        Nền tảng kết nối bạn với các gia đình cần dịch vụ chăm sóc
      </Text>

      <View className="w-full gap-4">
        <TouchableOpacity
          className="bg-blue-500 py-4 rounded-lg items-center"
          onPress={() => router.push('/(auth)/login')}
        >
          <Text className="text-white text-lg font-semibold">Đăng nhập</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white border-2 border-blue-500 py-4 rounded-lg items-center"
          onPress={() => router.push('/(auth)/register')}
        >
          <Text className="text-blue-500 text-lg font-semibold">Tạo tài khoản</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


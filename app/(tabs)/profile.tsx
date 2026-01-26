import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useAuthStore } from '../../store/auth.store';
import { SERVICE_TYPES } from '../../constants/serviceTypes';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const mockProfile = {
    avatar: null,
    bio: 'Tôi là điều dưỡng viên với 5 năm kinh nghiệm chăm sóc người già và bệnh nhân.',
    yearsExp: 5,
    skills: ['Tiêm thuốc', 'Sơ cứu', 'Chăm sóc người già'],
    serviceTypes: ['elderly', 'patient'],
    ratingAvg: 4.8,
    ratingCount: 24,
    hourlyRateHint: 250000,
    verifiedLevel: 1, // 0: PENDING, 1: APPROVED, 2: REJECTED
  };

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/welcome');
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      {/* Profile Header */}
      <View className="bg-white px-6 py-8 items-center">
        {mockProfile.avatar ? (
          <Image
            source={{ uri: mockProfile.avatar }}
            className="w-24 h-24 rounded-full mb-4"
          />
        ) : (
          <View className="w-24 h-24 rounded-full bg-blue-100 items-center justify-center mb-4">
            <Text className="text-4xl">👤</Text>
          </View>
        )}
        
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          {user?.fullName || 'CarePro'}
        </Text>
        
        <View className="flex-row items-center mb-4">
          <Text className="text-yellow-500 text-lg">⭐</Text>
          <Text className="text-gray-700 ml-2">
            {mockProfile.ratingAvg.toFixed(1)} ({mockProfile.ratingCount} đánh giá)
          </Text>
        </View>

        {mockProfile.verifiedLevel === 1 && (
          <View className="bg-green-100 px-3 py-1 rounded-full">
            <Text className="text-green-700 text-sm font-semibold">✓ Đã xác thực</Text>
          </View>
        )}
      </View>

      {/* Profile Info */}
      <View className="bg-white mt-2 px-6 py-4">
        <Text className="text-base font-semibold text-gray-900 mb-3">Thông tin cá nhân</Text>
        
        <View className="mb-4">
          <Text className="text-sm text-gray-600 mb-1">Giới thiệu</Text>
          <Text className="text-gray-900">{mockProfile.bio}</Text>
        </View>

        <View className="mb-4">
          <Text className="text-sm text-gray-600 mb-1">Kinh nghiệm</Text>
          <Text className="text-gray-900">{mockProfile.yearsExp} năm</Text>
        </View>

        <View className="mb-4">
          <Text className="text-sm text-gray-600 mb-2">Kỹ năng</Text>
          <View className="flex-row flex-wrap gap-2">
            {mockProfile.skills.map((skill, idx) => (
              <View key={idx} className="bg-blue-50 px-3 py-1 rounded-full">
                <Text className="text-blue-700 text-sm">{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-sm text-gray-600 mb-2">Loại dịch vụ</Text>
          <View className="flex-row flex-wrap gap-2">
            {mockProfile.serviceTypes.map((type) => {
              const service = SERVICE_TYPES.find((s) => s.id === type);
              return (
                <View key={type} className="bg-gray-100 px-3 py-1 rounded-full">
                  <Text className="text-gray-700 text-sm">
                    {service?.icon} {service?.name}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View>
          <Text className="text-sm text-gray-600 mb-1">Giá tham khảo</Text>
          <Text className="text-gray-900 font-semibold">
            {mockProfile.hourlyRateHint.toLocaleString('vi-VN')}đ/h
          </Text>
        </View>
      </View>

      {/* Menu Items */}
      <View className="mt-2">
        <TouchableOpacity
          className="bg-white px-6 py-4 flex-row items-center justify-between border-b border-gray-100"
          onPress={() => router.push('/profile/edit')}
        >
          <Text className="text-gray-900">Chỉnh sửa hồ sơ</Text>
          <Text className="text-gray-400">›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white px-6 py-4 flex-row items-center justify-between border-b border-gray-100"
          onPress={() => router.push('/profile/reviews')}
        >
          <Text className="text-gray-900">Đánh giá đã nhận</Text>
          <Text className="text-gray-400">›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white px-6 py-4 flex-row items-center justify-between border-b border-gray-100"
          onPress={() => router.push('/profile/availability')}
        >
          <Text className="text-gray-900">Lịch rảnh</Text>
          <Text className="text-gray-400">›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white px-6 py-4 flex-row items-center justify-between"
          onPress={() => router.push('/profile/settings')}
        >
          <Text className="text-gray-900">Cài đặt</Text>
          <Text className="text-gray-400">›</Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <View className="px-6 py-8">
        <TouchableOpacity
          className="bg-red-500 rounded-lg py-4 items-center"
          onPress={handleLogout}
        >
          <Text className="text-white font-semibold">Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


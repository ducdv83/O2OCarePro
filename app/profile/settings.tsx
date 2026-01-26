import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useAuthStore } from '../../store/auth.store';

export default function SettingsScreen() {
  const { logout } = useAuthStore();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/welcome');
          },
        },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="bg-white px-6 py-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900 ml-4">
          Cài đặt
        </Text>
      </View>

      {/* Notifications */}
      <View className="mt-2">
        <Text className="px-6 py-3 text-sm text-gray-600 font-semibold">
          THÔNG BÁO
        </Text>
        
        <View className="bg-white">
          <View className="px-6 py-4 flex-row items-center justify-between border-b border-gray-100">
            <View className="flex-1">
              <Text className="text-gray-900 font-medium">Thông báo đẩy</Text>
              <Text className="text-gray-500 text-sm mt-1">
                Nhận thông báo về ca làm việc mới, tin nhắn
              </Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: '#767577', true: '#007AFF' }}
            />
          </View>

          <View className="px-6 py-4 flex-row items-center justify-between border-b border-gray-100">
            <View className="flex-1">
              <Text className="text-gray-900 font-medium">Thông báo email</Text>
              <Text className="text-gray-500 text-sm mt-1">
                Nhận email về các cập nhật quan trọng
              </Text>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: '#767577', true: '#007AFF' }}
            />
          </View>

          <View className="px-6 py-4 flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-gray-900 font-medium">Thông báo SMS</Text>
              <Text className="text-gray-500 text-sm mt-1">
                Nhận SMS về các thông báo quan trọng
              </Text>
            </View>
            <Switch
              value={smsNotifications}
              onValueChange={setSmsNotifications}
              trackColor={{ false: '#767577', true: '#007AFF' }}
            />
          </View>
        </View>
      </View>

      {/* Account */}
      <View className="mt-6">
        <Text className="px-6 py-3 text-sm text-gray-600 font-semibold">
          TÀI KHOẢN
        </Text>
        
        <View className="bg-white">
          <TouchableOpacity
            className="px-6 py-4 flex-row items-center justify-between border-b border-gray-100"
            onPress={() => {
              Alert.alert('Thông báo', 'Tính năng đang phát triển');
            }}
          >
            <Text className="text-gray-900">Đổi số điện thoại</Text>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="px-6 py-4 flex-row items-center justify-between border-b border-gray-100"
            onPress={() => {
              Alert.alert('Thông báo', 'Tính năng đang phát triển');
            }}
          >
            <Text className="text-gray-900">Đổi mật khẩu</Text>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="px-6 py-4 flex-row items-center justify-between"
            onPress={() => {
              Alert.alert('Thông báo', 'Tính năng đang phát triển');
            }}
          >
            <Text className="text-gray-900">Xóa tài khoản</Text>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* App Info */}
      <View className="mt-6">
        <Text className="px-6 py-3 text-sm text-gray-600 font-semibold">
          ỨNG DỤNG
        </Text>
        
        <View className="bg-white">
          <TouchableOpacity
            className="px-6 py-4 flex-row items-center justify-between border-b border-gray-100"
            onPress={() => {
              Alert.alert('Thông báo', 'Tính năng đang phát triển');
            }}
          >
            <Text className="text-gray-900">Điều khoản sử dụng</Text>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="px-6 py-4 flex-row items-center justify-between border-b border-gray-100"
            onPress={() => {
              Alert.alert('Thông báo', 'Tính năng đang phát triển');
            }}
          >
            <Text className="text-gray-900">Chính sách bảo mật</Text>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <View className="px-6 py-4">
            <Text className="text-gray-500 text-sm">Phiên bản: 1.0.0</Text>
          </View>
        </View>
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


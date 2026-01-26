import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useAuthStore } from '../../store/auth.store';
import { SERVICE_TYPES } from '../../constants/serviceTypes';
import { mockJobs } from '../../utils/mockData';
import { Job } from '../../types/booking.types';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const filteredJobs = mockJobs.filter((job) => {
    if (!isAvailable) return false;
    if (selectedServiceType && job.serviceType !== selectedServiceType) return false;
    return job.status === 'OPEN';
  });

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="bg-white px-6 py-4">
        <Text className="text-2xl font-bold text-gray-900">
          Chào mừng, {user?.fullName || 'CarePro'}
        </Text>
        <Text className="text-gray-600 mt-1">
          Tìm ca làm việc phù hợp với bạn
        </Text>
      </View>

      {/* Toggle Available */}
      <View className="bg-white px-6 py-4 mt-2 flex-row items-center justify-between">
        <View>
          <Text className="text-base font-semibold text-gray-900">
            Trạng thái nhận ca
          </Text>
          <Text className="text-sm text-gray-600">
            {isAvailable ? 'Đang nhận ca' : 'Tạm dừng nhận ca'}
          </Text>
        </View>
        <Switch
          value={isAvailable}
          onValueChange={setIsAvailable}
          trackColor={{ false: '#767577', true: '#007AFF' }}
        />
      </View>

      {/* Service Type Filter */}
      {isAvailable && (
        <View className="px-6 py-4">
          <Text className="text-base font-semibold text-gray-900 mb-3">
            Lọc theo loại dịch vụ
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-3">
              <TouchableOpacity
                className={`px-4 py-2 rounded-full border ${
                  selectedServiceType === null
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-white'
                }`}
                onPress={() => setSelectedServiceType(null)}
              >
                <Text
                  className={`text-sm ${
                    selectedServiceType === null
                      ? 'text-blue-700 font-semibold'
                      : 'text-gray-700'
                  }`}
                >
                  Tất cả
                </Text>
              </TouchableOpacity>
              {SERVICE_TYPES.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  className={`px-4 py-2 rounded-full border ${
                    selectedServiceType === service.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-white'
                  }`}
                  onPress={() => setSelectedServiceType(service.id)}
                >
                  <Text
                    className={`text-sm ${
                      selectedServiceType === service.id
                        ? 'text-blue-700 font-semibold'
                        : 'text-gray-700'
                    }`}
                  >
                    {service.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Jobs List */}
      {isAvailable ? (
        <View className="px-6 py-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Ca làm việc gần bạn ({filteredJobs.length})
          </Text>
          {filteredJobs.length === 0 ? (
            <View className="bg-white rounded-lg p-8 items-center">
              <Text className="text-5xl mb-4">🔍</Text>
              <Text className="text-gray-900 text-lg font-semibold mb-2 text-center">
                Không tìm thấy ca nào
              </Text>
              <Text className="text-gray-600 text-center text-sm">
                Hãy thử điều chỉnh bộ lọc hoặc kiểm tra lại sau
              </Text>
            </View>
          ) : (
            <View className="gap-4">
              {filteredJobs.map((job) => (
                <TouchableOpacity
                  key={job.id}
                  className="bg-white rounded-lg p-4 shadow-sm"
                  onPress={() => router.push(`/job/${job.id}`)}
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-900 mb-1">
                        {SERVICE_TYPES.find((s) => s.id === job.serviceType)?.name}
                      </Text>
                      <Text className="text-sm text-gray-600 mb-2" numberOfLines={2}>
                        {job.description}
                      </Text>
                    </View>
                    {job.fitScore && (
                      <View className="bg-green-100 px-2 py-1 rounded">
                        <Text className="text-green-700 text-xs font-semibold">
                          {job.fitScore}% phù hợp
                        </Text>
                      </View>
                    )}
                  </View>

                  <View className="flex-row items-center gap-4 mb-3">
                    <Text className="text-sm text-gray-600">📍 {job.distance} km</Text>
                    <Text className="text-sm text-gray-600">
                      💰 {job.budgetMin.toLocaleString('vi-VN')} - {job.budgetMax.toLocaleString('vi-VN')}đ/h
                    </Text>
                  </View>

                  <View className="flex-row items-center justify-between pt-3 border-t border-gray-200">
                    <Text className="text-sm text-gray-600">
                      {new Date(job.startTime).toLocaleDateString('vi-VN', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'numeric',
                      })}{' '}
                      {new Date(job.startTime).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                    <TouchableOpacity
                      className="bg-blue-500 px-4 py-2 rounded-lg"
                      onPress={() => router.push(`/job/${job.id}`)}
                    >
                      <Text className="text-white font-semibold">Xem chi tiết</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ) : (
        <View className="px-6 py-8 items-center">
          <Text className="text-4xl mb-4">⏸️</Text>
          <Text className="text-gray-600 text-center text-lg">
            Bạn đang tạm dừng nhận ca.{'\n'}Bật lại để xem các ca làm việc.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}


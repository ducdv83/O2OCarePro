import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { mockJobs } from '../../utils/mockData';
import { SERVICE_TYPES } from '../../constants/serviceTypes';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const job = mockJobs.find((j) => j.id === id);

  if (!job) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-600">Không tìm thấy ca làm việc</Text>
        <TouchableOpacity
          className="mt-4 bg-blue-500 px-6 py-3 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const serviceType = SERVICE_TYPES.find((s) => s.id === job.serviceType);

  const handleAcceptJob = () => {
    router.push({
      pathname: `/job/${id}/propose`,
    });
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
          Chi tiết ca làm việc
        </Text>
      </View>

      {/* Job Info */}
      <View className="bg-white mt-2 px-6 py-6">
        <View className="flex-row items-center mb-4">
          <Text className="text-4xl mr-3">{serviceType?.icon}</Text>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900 mb-1">
              {serviceType?.name}
            </Text>
            {job.fitScore && (
              <View className="bg-green-100 px-2 py-1 rounded self-start">
                <Text className="text-green-700 text-xs font-semibold">
                  {job.fitScore}% phù hợp với bạn
                </Text>
              </View>
            )}
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-base font-semibold text-gray-900 mb-2">Mô tả công việc</Text>
          <Text className="text-gray-700 leading-6">{job.description}</Text>
        </View>

        <View className="mb-4">
          <Text className="text-base font-semibold text-gray-900 mb-2">Thời gian</Text>
          <Text className="text-gray-700">
            {format(job.startTime, 'EEEE, dd/MM/yyyy', { locale: vi })}
          </Text>
          <Text className="text-gray-700">
            {format(job.startTime, 'HH:mm')} - {format(job.endTime, 'HH:mm')}
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-base font-semibold text-gray-900 mb-2">Địa điểm</Text>
          <Text className="text-gray-700">📍 {job.location.address}</Text>
          {job.distance && (
            <Text className="text-gray-600 text-sm mt-1">
              Khoảng cách: {job.distance} km
            </Text>
          )}
        </View>

        <View className="mb-4">
          <Text className="text-base font-semibold text-gray-900 mb-2">Khung giá</Text>
          <Text className="text-gray-700 text-lg">
            {job.budgetMin.toLocaleString('vi-VN')} - {job.budgetMax.toLocaleString('vi-VN')}đ/h
          </Text>
          <Text className="text-gray-500 text-sm mt-1">
            Bạn có thể đề nghị giá trong khung này
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-base font-semibold text-gray-900 mb-2">Thông tin khách hàng</Text>
          <Text className="text-gray-700">Tên: [Ẩn để bảo mật]</Text>
          <Text className="text-gray-500 text-sm mt-1">
            Thông tin chi tiết sẽ được hiển thị sau khi bạn được chấp nhận
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View className="px-6 py-4 gap-3">
        <TouchableOpacity
          className="bg-blue-500 rounded-lg py-4 items-center"
          onPress={handleAcceptJob}
        >
          <Text className="text-white text-lg font-semibold">Nhận ca / Đề nghị giá</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white border-2 border-gray-300 rounded-lg py-4 items-center"
          onPress={() => router.back()}
        >
          <Text className="text-gray-700 text-lg font-semibold">Quay lại</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


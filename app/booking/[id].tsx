import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { mockBookings } from '../../utils/mockData';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const booking = mockBookings.find((b) => b.id === id);

  if (!booking) {
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

      {/* Booking Info */}
      <View className="bg-white mt-2 px-6 py-6">
        <View className="mb-4">
          <Text className="text-2xl font-bold text-gray-900 mb-1">
            {booking.clientName}
          </Text>
          <Text className="text-gray-600">📍 {booking.location.address}</Text>
        </View>

        <View className="mb-4">
          <Text className="text-base font-semibold text-gray-900 mb-2">Thời gian</Text>
          <Text className="text-gray-700">
            {format(booking.startTime, 'EEEE, dd/MM/yyyy', { locale: vi })}
          </Text>
          <Text className="text-gray-700">
            {format(booking.startTime, 'HH:mm')} - {format(booking.endTime, 'HH:mm')}
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-base font-semibold text-gray-900 mb-2">Giá thỏa thuận</Text>
          <Text className="text-gray-900 text-xl font-bold">
            {booking.agreedRate.toLocaleString('vi-VN')}đ/h
          </Text>
        </View>

        {booking.timesheet && (
          <View className="mb-4">
            <Text className="text-base font-semibold text-gray-900 mb-2">Chấm công</Text>
            {booking.timesheet.checkinAt && (
              <Text className="text-gray-700">
                Check-in: {format(booking.timesheet.checkinAt, 'HH:mm dd/MM/yyyy')}
              </Text>
            )}
            {booking.timesheet.checkoutAt && (
              <Text className="text-gray-700">
                Check-out: {format(booking.timesheet.checkoutAt, 'HH:mm dd/MM/yyyy')}
              </Text>
            )}
            {booking.timesheet.hours && (
              <Text className="text-gray-700">
                Tổng giờ: {booking.timesheet.hours} giờ
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Actions */}
      <View className="px-6 py-4 gap-3">
        {booking.status === 'SCHEDULED' && (
          <TouchableOpacity
            className="bg-blue-500 rounded-lg py-4 items-center"
            onPress={() => router.push(`/booking/${id}/timesheet`)}
          >
            <Text className="text-white text-lg font-semibold">Bắt đầu ca - Check-in</Text>
          </TouchableOpacity>
        )}

        {booking.status === 'IN_PROGRESS' && (
          <TouchableOpacity
            className="bg-green-500 rounded-lg py-4 items-center"
            onPress={() => router.push(`/booking/${id}/timesheet`)}
          >
            <Text className="text-white text-lg font-semibold">Chấm công</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          className="bg-white border-2 border-gray-300 rounded-lg py-4 items-center"
          onPress={() => router.push(`/chat/${booking.id}`)}
        >
          <Text className="text-gray-700 text-lg font-semibold">💬 Chat với khách hàng</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-red-50 border-2 border-red-200 rounded-lg py-4 items-center"
          onPress={() => {
            // Handle SOS
          }}
        >
          <Text className="text-red-600 text-lg font-semibold">🆘 SOS - Cần hỗ trợ</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


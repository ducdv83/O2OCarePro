import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { mockBookings } from '../../utils/mockData';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <ScrollView className="flex-1">
        <StatusBar style="dark" />
      
      {/* Header */}
      <View className="bg-white px-6 pt-6 pb-5 flex-row items-center border-b border-slate-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-slate-900 ml-4">
          Chi tiết ca làm việc
        </Text>
      </View>

      {/* Booking Info */}
      <View className="bg-white mt-3 mx-4 rounded-2xl px-5 py-6 border border-slate-100">
        <View className="mb-4">
          <Text className="text-2xl font-semibold text-slate-900 mb-1">
            {booking.clientName}
          </Text>
          <Text className="text-slate-600">{booking.location.address}</Text>
        </View>

        <View className="mb-4">
          <Text className="text-base font-semibold text-slate-900 mb-2">Thời gian</Text>
          <Text className="text-slate-700">
            {format(booking.startTime, 'EEEE, dd/MM/yyyy', { locale: vi })}
          </Text>
          <Text className="text-slate-700">
            {format(booking.startTime, 'HH:mm')} - {format(booking.endTime, 'HH:mm')}
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-base font-semibold text-slate-900 mb-2">Giá thỏa thuận</Text>
          <Text className="text-slate-900 text-xl font-semibold">
            {booking.agreedRate.toLocaleString('vi-VN')}đ/h
          </Text>
        </View>

        {booking.timesheet && (
          <View className="mb-4">
            <Text className="text-base font-semibold text-slate-900 mb-2">Chấm công</Text>
            {booking.timesheet.checkinAt && (
              <Text className="text-slate-700">
                Check-in: {format(booking.timesheet.checkinAt, 'HH:mm dd/MM/yyyy')}
              </Text>
            )}
            {booking.timesheet.checkoutAt && (
              <Text className="text-slate-700">
                Check-out: {format(booking.timesheet.checkoutAt, 'HH:mm dd/MM/yyyy')}
              </Text>
            )}
            {booking.timesheet.hours && (
              <Text className="text-slate-700">
                Tổng giờ: {booking.timesheet.hours} giờ
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Actions */}
      <View className="mx-4 mt-4 mb-6 gap-3">
        {booking.status === 'SCHEDULED' && (
          <TouchableOpacity
            className="bg-blue-600 rounded-full py-4 items-center"
            onPress={() => router.push(`/booking/${id}/timesheet`)}
          >
            <Text className="text-white text-base font-semibold">Bắt đầu ca - Check-in</Text>
          </TouchableOpacity>
        )}

        {booking.status === 'IN_PROGRESS' && (
          <TouchableOpacity
            className="bg-emerald-600 rounded-full py-4 items-center"
            onPress={() => router.push(`/booking/${id}/timesheet`)}
          >
            <Text className="text-white text-base font-semibold">Chấm công</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          className="bg-white border border-slate-200 rounded-full py-4 items-center"
          onPress={() => router.push(`/chat/${booking.id}`)}
        >
          <Text className="text-slate-700 text-base font-semibold">Chat với khách hàng</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-rose-50 border border-rose-200 rounded-full py-4 items-center"
          onPress={() => {
            // Handle SOS
          }}
        >
          <Text className="text-rose-600 text-base font-semibold">SOS - Cần hỗ trợ</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}


import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { mockBookings } from '../../utils/mockData';
import { Booking, BookingStatus } from '../../types/booking.types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const TABS: { key: BookingStatus | 'ALL'; label: string }[] = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'SCHEDULED', label: 'Sắp tới' },
  { key: 'IN_PROGRESS', label: 'Đang làm' },
  { key: 'COMPLETED', label: 'Hoàn tất' },
  { key: 'CANCELLED', label: 'Đã hủy' },
];

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState<BookingStatus | 'ALL'>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const filteredBookings = mockBookings.filter((booking) => {
    if (activeTab === 'ALL') return true;
    return booking.status === activeTab;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-700';
      case 'IN_PROGRESS':
        return 'bg-green-100 text-green-700';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: BookingStatus) => {
    switch (status) {
      case 'SCHEDULED':
        return 'Sắp tới';
      case 'IN_PROGRESS':
        return 'Đang làm';
      case 'COMPLETED':
        return 'Hoàn tất';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="bg-white px-6 py-4">
        <Text className="text-2xl font-bold text-gray-900">
          Ca đã nhận
        </Text>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="bg-white border-b border-gray-200"
      >
        <View className="flex-row px-4">
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              className={`px-4 py-3 border-b-2 ${
                activeTab === tab.key
                  ? 'border-blue-500'
                  : 'border-transparent'
              }`}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text
                className={`text-sm font-medium ${
                  activeTab === tab.key
                    ? 'text-blue-600'
                    : 'text-gray-600'
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bookings List */}
      <ScrollView
        className="flex-1 px-6 py-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredBookings.length === 0 ? (
          <View className="bg-white rounded-lg p-8 items-center mt-8">
            <Text className="text-5xl mb-4">📅</Text>
            <Text className="text-gray-900 text-lg font-semibold mb-2 text-center">
              Chưa có ca nào
            </Text>
            <Text className="text-gray-600 text-center text-sm">
              {activeTab === 'ALL'
                ? 'Bạn chưa nhận ca nào. Hãy bật trạng thái nhận ca để xem các ca mới.'
                : `Chưa có ca nào trong mục "${TABS.find((t) => t.key === activeTab)?.label}".`}
            </Text>
          </View>
        ) : (
          <View className="gap-4">
            {filteredBookings.map((booking) => (
              <TouchableOpacity
                key={booking.id}
                className="bg-white rounded-lg p-4 shadow-sm"
                onPress={() => router.push(`/booking/${booking.id}`)}
              >
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900 mb-1">
                      {booking.clientName}
                    </Text>
                    <Text className="text-sm text-gray-600" numberOfLines={2}>
                      {booking.location.address}
                    </Text>
                  </View>
                  <View className={`px-2 py-1 rounded ${getStatusColor(booking.status)}`}>
                    <Text className={`text-xs font-semibold ${getStatusColor(booking.status).split(' ')[1]}`}>
                      {getStatusLabel(booking.status)}
                    </Text>
                  </View>
                </View>

                <View className="mb-3">
                  <Text className="text-sm text-gray-600 mb-1">
                    📅 {format(booking.startTime, 'EEEE, dd/MM/yyyy', { locale: vi })}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    ⏰ {format(booking.startTime, 'HH:mm')} - {format(booking.endTime, 'HH:mm')}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center pt-3 border-t border-gray-200">
                  <Text className="text-base font-semibold text-gray-900">
                    {booking.agreedRate.toLocaleString('vi-VN')}đ/h
                  </Text>
                  {booking.status === 'IN_PROGRESS' && (
                    <TouchableOpacity
                      className="bg-green-500 px-4 py-2 rounded-lg"
                      onPress={() => router.push(`/booking/${booking.id}/timesheet`)}
                    >
                      <Text className="text-white font-semibold">Chấm công</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}


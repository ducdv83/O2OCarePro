import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Booking, BookingStatus } from '../../types/booking.types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { SafeAreaView } from 'react-native-safe-area-context';
import { bookingsApi } from '../../services/api/bookings.api';
import { mapApiBookingToUiBooking } from '../../utils/apiMappers';
import { ErrorState } from '../../components/ui/ErrorState';

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
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === 'ALL') return true;
    return booking.status === activeTab;
  });

  const loadBookings = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const status = activeTab === 'ALL' ? undefined : activeTab;
      const response = await bookingsApi.findAll(status ? { status } : undefined);
      setBookings(response.map(mapApiBookingToUiBooking));
    } catch (error: any) {
      setErrorMessage(error?.message || 'Không thể tải danh sách ca.');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  useEffect(() => {
    loadBookings();
  }, [activeTab]);

  const getStatusStyle = (status: BookingStatus) => {
    switch (status) {
      case 'SCHEDULED':
        return { bg: 'bg-blue-50', text: 'text-blue-700' };
      case 'IN_PROGRESS':
        return { bg: 'bg-emerald-50', text: 'text-emerald-700' };
      case 'COMPLETED':
        return { bg: 'bg-slate-100', text: 'text-slate-700' };
      case 'CANCELLED':
        return { bg: 'bg-rose-50', text: 'text-rose-700' };
      default:
        return { bg: 'bg-slate-100', text: 'text-slate-700' };
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
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="bg-white px-6 pt-6 pb-5 border-b border-slate-100">
        <Text className="text-2xl font-semibold text-slate-900">
          Ca đã nhận
        </Text>
      </View>

      {/* Bookings List */}
      <ScrollView
        className="flex-1 px-4 pt-2"
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        stickyHeaderIndices={[0]}
      >
        <View className="bg-white -mx-4 px-4 pt-2 pb-2">
          <View className="flex-row items-center gap-2">
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                className={`h-9 px-4 rounded-full items-center justify-center ${
                  activeTab === tab.key ? 'bg-blue-600' : 'bg-slate-100'
                }`}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text
                  className={`text-sm font-medium ${
                    activeTab === tab.key ? 'text-white' : 'text-slate-700'
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {errorMessage ? (
          <ErrorState message={errorMessage} onRetry={loadBookings} />
        ) : loading ? (
          <View className="bg-white rounded-2xl p-8 items-center mt-8 border border-slate-100">
            <Text className="text-slate-600 text-center text-sm">Đang tải dữ liệu...</Text>
          </View>
        ) : filteredBookings.length === 0 ? (
          <View className="bg-white rounded-2xl p-8 items-center mt-8 border border-slate-100">
            <View className="w-12 h-12 rounded-full bg-blue-50 mb-4" />
            <Text className="text-slate-900 text-lg font-semibold mb-2 text-center">
              Chưa có ca nào
            </Text>
            <Text className="text-slate-600 text-center text-sm">
              {activeTab === 'ALL'
                ? 'Bạn chưa nhận ca nào. Hãy bật trạng thái nhận ca để xem các ca mới.'
                : `Chưa có ca nào trong mục "${TABS.find((t) => t.key === activeTab)?.label}".`}
            </Text>
          </View>
        ) : (
          <View className="gap-4">
            {filteredBookings.map((booking) => {
              const statusStyle = getStatusStyle(booking.status);
              return (
                <TouchableOpacity
                  key={booking.id}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
                  onPress={() => router.push(`/booking/${booking.id}`)}
                >
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-slate-900 mb-1">
                        {booking.clientName}
                      </Text>
                      <Text className="text-sm text-slate-600" numberOfLines={2}>
                        {booking.location.address}
                      </Text>
                    </View>
                    <View className={`px-3 py-1 rounded-full ${statusStyle.bg}`}>
                      <Text className={`text-xs font-semibold ${statusStyle.text}`}>
                        {getStatusLabel(booking.status)}
                      </Text>
                    </View>
                  </View>

                  <View className="mb-3">
                    <Text className="text-sm text-slate-600 mb-1">
                      Ngày {format(booking.startTime, 'EEEE, dd/MM/yyyy', { locale: vi })}
                    </Text>
                    <Text className="text-sm text-slate-600">
                      Giờ {format(booking.startTime, 'HH:mm')} - {format(booking.endTime, 'HH:mm')}
                    </Text>
                  </View>

                  <View className="flex-row justify-between items-center pt-3 border-t border-slate-100">
                    <Text className="text-base font-semibold text-slate-900">
                      {booking.agreedRate.toLocaleString('vi-VN')}đ/h
                    </Text>
                    {booking.status === 'IN_PROGRESS' && (
                      <TouchableOpacity
                        className="bg-emerald-600 px-4 py-2 rounded-full"
                        onPress={() => router.push(`/booking/${booking.id}/timesheet`)}
                      >
                        <Text className="text-white text-sm font-semibold">Chấm công</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}


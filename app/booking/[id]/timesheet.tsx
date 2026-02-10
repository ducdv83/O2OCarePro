import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { format } from 'date-fns';
import { bookingsApi } from '../../../services/api/bookings.api';
import { timesheetsApi, Timesheet } from '../../../services/api/timesheets.api';
import { Booking } from '../../../types/booking.types';
import { mapApiBookingToUiBooking } from '../../../utils/apiMappers';
import { ErrorState } from '../../../components/ui/ErrorState';
import { layout } from '../../../constants/layout';

export default function TimesheetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [timesheet, setTimesheet] = useState<Timesheet | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [timer, setTimer] = useState(0); // seconds
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadBooking = async () => {
    if (!id) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await bookingsApi.findOne(id);
      const mapped = mapApiBookingToUiBooking(response);
      setBooking(mapped);
      if (response?.timesheet) {
        setTimesheet(response.timesheet);
      } else {
        try {
          const ts = await timesheetsApi.getOne(id);
          setTimesheet(ts);
        } catch {
          setTimesheet(null);
        }
      }
    } catch (error: any) {
      setErrorMessage(error?.message || 'Không thể tải thông tin chấm công.');
      setBooking(null);
      setTimesheet(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooking();
  }, [id]);

  useEffect(() => {
    if (timesheet?.checkin_at) {
      setIsCheckedIn(true);
      const checkinTime = new Date(timesheet.checkin_at).getTime();
      const now = Date.now();
      if (now > checkinTime) {
        setTimer(Math.floor((now - checkinTime) / 1000));
      }
    }
    if (timesheet?.checkout_at) {
      setIsCheckedOut(true);
    }
  }, [timesheet]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCheckedIn && !isCheckedOut) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCheckedIn, isCheckedOut]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleCheckIn = async () => {
    if (!id) return;
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Lỗi', 'Cần quyền truy cập vị trí để check-in');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    try {
      const ts = await timesheetsApi.checkIn(id, {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
      setTimesheet(ts);
      Alert.alert('Thành công', 'Đã check-in thành công!');
      setIsCheckedIn(true);
    } catch (error: any) {
      Alert.alert('Lỗi', error?.message || 'Không thể check-in. Vui lòng thử lại.');
    }
  };

  const handleCheckOut = async () => {
    if (!id) return;
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Lỗi', 'Cần quyền truy cập vị trí để check-out');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    try {
      const ts = await timesheetsApi.checkOut(id, {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
        note: notes || undefined,
      });
      setTimesheet(ts);
      Alert.alert('Thành công', 'Đã check-out thành công!');
      setIsCheckedOut(true);
    } catch (error: any) {
      Alert.alert('Lỗi', error?.message || 'Không thể check-out. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'bottom']}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text className="text-gray-600">Đang tải dữ liệu...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorMessage) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'bottom']}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: layout.horizontalPadding }}>
          <ErrorState message={errorMessage} onRetry={loadBooking} />
        </View>
      </SafeAreaView>
    );
  }

  if (!booking) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'bottom']}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text className="text-gray-600">Không tìm thấy ca làm việc</Text>
          <TouchableOpacity
            className="mt-4 bg-blue-500 px-6 py-3 rounded-lg"
            onPress={() => router.back()}
          >
            <Text className="text-white font-semibold">Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const pad = layout.horizontalPadding;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }} edges={['top', 'bottom']}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: layout.scrollBottomPadding }}>
        <StatusBar style="dark" />
        {/* Header */}
        <View style={{ backgroundColor: '#fff', paddingHorizontal: pad, paddingVertical: 16, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900 ml-4">
          Chấm công
        </Text>
      </View>

      {/* Booking Info */}
      <View style={{ backgroundColor: '#fff', marginTop: 8, paddingHorizontal: pad, paddingVertical: 24 }}>
        <Text className="text-xl font-bold text-gray-900 mb-2">
          {booking.clientName}
        </Text>
        <Text className="text-gray-600 mb-4">📍 {booking.location.address}</Text>
        
        <View className="flex-row justify-between items-center py-4 border-t border-gray-200">
          <Text className="text-gray-700">Thời gian bắt đầu</Text>
          <Text className="text-gray-900 font-semibold">
            {format(booking.startTime, 'HH:mm dd/MM/yyyy')}
          </Text>
        </View>
        <View className="flex-row justify-between items-center py-4 border-t border-gray-200">
          <Text className="text-gray-700">Thời gian kết thúc</Text>
          <Text className="text-gray-900 font-semibold">
            {format(booking.endTime, 'HH:mm dd/MM/yyyy')}
          </Text>
        </View>
      </View>

      {/* Check-in */}
      <View style={{ backgroundColor: '#fff', marginTop: 8, paddingHorizontal: pad, paddingVertical: 24 }}>
        <Text className="text-lg font-semibold text-gray-900 mb-4">Check-in</Text>
        {isCheckedIn ? (
          <View className="bg-green-50 border border-green-200 rounded-lg p-4">
            <Text className="text-green-700 font-semibold mb-1">✓ Đã check-in</Text>
            <Text className="text-green-600 text-sm">
              {timesheet?.checkin_at
                ? format(new Date(timesheet.checkin_at), 'HH:mm dd/MM/yyyy')
                : 'Vừa xong'}
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            className="bg-blue-500 rounded-lg py-4 items-center"
            onPress={handleCheckIn}
          >
            <Text className="text-white text-lg font-semibold">Check-in</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Timer */}
      {isCheckedIn && !isCheckedOut && (
        <View style={{ backgroundColor: '#fff', marginTop: 8, paddingHorizontal: pad, paddingVertical: 24 }}>
          <Text className="text-lg font-semibold text-gray-900 mb-4">Thời gian làm việc</Text>
          <View className="bg-blue-50 rounded-lg p-6 items-center">
            <Text className="text-blue-600 text-4xl font-bold">
              {formatTime(timer)}
            </Text>
          </View>
        </View>
      )}

      {/* Notes */}
      {isCheckedIn && (
        <View style={{ backgroundColor: '#fff', marginTop: 8, paddingHorizontal: pad, paddingVertical: 24 }}>
          <Text className="text-lg font-semibold text-gray-900 mb-4">Ghi chú chuyên môn</Text>
          <Text className="text-gray-600 text-sm mb-2">
            Ghi chú về công việc đã thực hiện (tùy chọn)
          </Text>
          <View className="border border-gray-300 rounded-lg p-4 min-h-[100px]">
            <Text className="text-gray-700">{notes || 'Chưa có ghi chú'}</Text>
          </View>
        </View>
      )}

      {/* Check-out */}
      {isCheckedIn && (
        <View style={{ backgroundColor: '#fff', marginTop: 8, paddingHorizontal: pad, paddingVertical: 24 }}>
          <Text className="text-lg font-semibold text-gray-900 mb-4">Check-out</Text>
          {isCheckedOut ? (
            <View className="bg-green-50 border border-green-200 rounded-lg p-4">
              <Text className="text-green-700 font-semibold mb-1">✓ Đã check-out</Text>
              <Text className="text-green-600 text-sm">
                {timesheet?.checkout_at
                  ? format(new Date(timesheet.checkout_at), 'HH:mm dd/MM/yyyy')
                  : 'Vừa xong'}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              className="bg-green-500 rounded-lg py-4 items-center"
              onPress={handleCheckOut}
            >
              <Text className="text-white text-lg font-semibold">Check-out</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Client Confirmation */}
      {isCheckedOut && (
        <View style={{ backgroundColor: '#fff', marginTop: 8, paddingHorizontal: pad, paddingVertical: 24 }}>
          <Text className="text-lg font-semibold text-gray-900 mb-2">Xác nhận từ khách hàng</Text>
          {Boolean(timesheet?.client_confirmed) ? (
            <View className="bg-green-50 border border-green-200 rounded-lg p-4">
              <Text className="text-green-700 font-semibold">✓ Đã được xác nhận</Text>
            </View>
          ) : (
            <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <Text className="text-yellow-700">⏳ Đang chờ khách hàng xác nhận</Text>
            </View>
          )}
        </View>
      )}
      </ScrollView>
    </SafeAreaView>
  );
}


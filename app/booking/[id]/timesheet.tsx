import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import { mockBookings } from '../../../utils/mockData';
import { format } from 'date-fns';

export default function TimesheetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const booking = mockBookings.find((b) => b.id === id);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [timer, setTimer] = useState(0); // seconds
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (booking?.timesheet?.checkinAt) {
      setIsCheckedIn(true);
    }
    if (booking?.timesheet?.checkoutAt) {
      setIsCheckedOut(true);
    }
  }, [booking]);

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
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Lỗi', 'Cần quyền truy cập vị trí để check-in');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    
    // Mock check-in
    Alert.alert('Thành công', 'Đã check-in thành công!');
    setIsCheckedIn(true);
  };

  const handleCheckOut = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Lỗi', 'Cần quyền truy cập vị trí để check-out');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    
    // Mock check-out
    Alert.alert('Thành công', 'Đã check-out thành công!');
    setIsCheckedOut(true);
  };

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
          Chấm công
        </Text>
      </View>

      {/* Booking Info */}
      <View className="bg-white mt-2 px-6 py-6">
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
      <View className="bg-white mt-2 px-6 py-6">
        <Text className="text-lg font-semibold text-gray-900 mb-4">Check-in</Text>
        {isCheckedIn ? (
          <View className="bg-green-50 border border-green-200 rounded-lg p-4">
            <Text className="text-green-700 font-semibold mb-1">✓ Đã check-in</Text>
            <Text className="text-green-600 text-sm">
              {booking.timesheet?.checkinAt
                ? format(booking.timesheet.checkinAt, 'HH:mm dd/MM/yyyy')
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
        <View className="bg-white mt-2 px-6 py-6">
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
        <View className="bg-white mt-2 px-6 py-6">
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
        <View className="bg-white mt-2 px-6 py-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Check-out</Text>
          {isCheckedOut ? (
            <View className="bg-green-50 border border-green-200 rounded-lg p-4">
              <Text className="text-green-700 font-semibold mb-1">✓ Đã check-out</Text>
              <Text className="text-green-600 text-sm">
                {booking.timesheet?.checkoutAt
                  ? format(booking.timesheet.checkoutAt, 'HH:mm dd/MM/yyyy')
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
        <View className="bg-white mt-2 px-6 py-6">
          <Text className="text-lg font-semibold text-gray-900 mb-2">Xác nhận từ khách hàng</Text>
          {booking.timesheet?.clientConfirmed ? (
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
  );
}


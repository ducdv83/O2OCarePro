import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { SafeAreaView } from 'react-native-safe-area-context';

interface TimeSlot {
  start: string;
  end: string;
}

interface DayAvailability {
  date: string;
  slots: TimeSlot[];
  isAvailable: boolean;
}

export default function AvailabilityScreen() {
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [availability, setAvailability] = useState<DayAvailability[]>([
    {
      date: format(new Date(), 'yyyy-MM-dd'),
      slots: [{ start: '08:00', end: '17:00' }],
      isAvailable: true,
    },
  ]);
  const [loading, setLoading] = useState(false);

  const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const weekDates: string[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    weekDates.push(format(date, 'yyyy-MM-dd'));
  }

  const getDayAvailability = (date: string): DayAvailability | undefined => {
    return availability.find((a) => a.date === date);
  };

  const toggleDayAvailability = (date: string) => {
    const existing = getDayAvailability(date);
    if (existing) {
      setAvailability(
        availability.map((a) =>
          a.date === date ? { ...a, isAvailable: !a.isAvailable } : a
        )
      );
    } else {
      setAvailability([
        ...availability,
        {
          date,
          slots: [{ start: '08:00', end: '17:00' }],
          isAvailable: true,
        },
      ]);
    }
  };

  const addTimeSlot = (date: string) => {
    const dayAvail = getDayAvailability(date);
    if (dayAvail) {
      setAvailability(
        availability.map((a) =>
          a.date === date
            ? {
                ...a,
                slots: [...a.slots, { start: '08:00', end: '17:00' }],
              }
            : a
        )
      );
    }
  };

  const removeTimeSlot = (date: string, index: number) => {
    const dayAvail = getDayAvailability(date);
    if (dayAvail && dayAvail.slots.length > 1) {
      setAvailability(
        availability.map((a) =>
          a.date === date
            ? {
                ...a,
                slots: a.slots.filter((_, i) => i !== index),
              }
            : a
        )
      );
    }
  };

  const handleSave = async () => {
    setLoading(true);
    // Mock save availability
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Thành công', 'Đã cập nhật lịch rảnh thành công', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="bg-white px-6 pt-6 pb-5 flex-row items-center border-b border-slate-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-slate-900 ml-4">
          Lịch rảnh
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="px-6 py-6">
        <Text className="text-base text-gray-600 mb-6">
          Thiết lập lịch rảnh để khách hàng biết khi nào bạn có thể nhận ca
        </Text>

        {/* Week Calendar */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-900 mb-4">
            Tuần này
          </Text>
          <View className="flex-row gap-2">
            {weekDates.map((date, index) => {
              const dayAvail = getDayAvailability(date);
              const isSelected = selectedDate === date;
              const isAvailable = dayAvail?.isAvailable ?? false;

              return (
                <TouchableOpacity
                  key={date}
                  className={`flex-1 items-center py-3 rounded-lg border-2 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : isAvailable
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-300 bg-white'
                  }`}
                  onPress={() => setSelectedDate(date)}
                >
                  <Text className="text-xs text-gray-600 mb-1">
                    {daysOfWeek[index]}
                  </Text>
                  <Text className="text-lg font-semibold text-gray-900">
                    {format(new Date(date), 'd')}
                  </Text>
                  {isAvailable && (
                    <Text className="text-xs text-green-600 mt-1">✓ Rảnh</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Selected Day Details */}
        {selectedDate && (
          <View className="bg-white rounded-lg p-4 mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-base font-semibold text-gray-900">
                {format(new Date(selectedDate), 'EEEE, dd/MM/yyyy', {
                  locale: vi,
                })}
              </Text>
              <TouchableOpacity
                className={`px-4 py-2 rounded-lg ${
                  getDayAvailability(selectedDate)?.isAvailable
                    ? 'bg-green-100'
                    : 'bg-gray-100'
                }`}
                onPress={() => toggleDayAvailability(selectedDate)}
              >
                <Text
                  className={`text-sm font-semibold ${
                    getDayAvailability(selectedDate)?.isAvailable
                      ? 'text-green-700'
                      : 'text-gray-700'
                  }`}
                >
                  {getDayAvailability(selectedDate)?.isAvailable
                    ? 'Đang rảnh'
                    : 'Không rảnh'}
                </Text>
              </TouchableOpacity>
            </View>

            {getDayAvailability(selectedDate)?.isAvailable && (
              <View>
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-sm text-gray-700">Khung giờ</Text>
                  <TouchableOpacity
                    className="bg-blue-100 px-3 py-1 rounded"
                    onPress={() => addTimeSlot(selectedDate)}
                  >
                    <Text className="text-blue-700 text-sm">+ Thêm khung giờ</Text>
                  </TouchableOpacity>
                </View>

                {getDayAvailability(selectedDate)?.slots.map((slot, index) => (
                  <View
                    key={index}
                    className="flex-row items-center justify-between mb-2 p-3 bg-gray-50 rounded-lg"
                  >
                    <Text className="text-gray-900">
                      {slot.start} - {slot.end}
                    </Text>
                    {getDayAvailability(selectedDate)?.slots.length > 1 && (
                      <TouchableOpacity
                        onPress={() => removeTimeSlot(selectedDate, index)}
                      >
                        <Text className="text-red-500">Xóa</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

          <TouchableOpacity
            className={`bg-blue-600 py-4 rounded-xl items-center mt-4 mb-8 ${loading ? 'opacity-50' : ''}`}
            onPress={handleSave}
            disabled={loading}
          >
            <Text className="text-white text-lg font-semibold">
              {loading ? 'Đang lưu...' : 'Lưu lịch rảnh'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


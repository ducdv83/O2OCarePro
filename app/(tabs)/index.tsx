import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useAuthStore } from '../../store/auth.store';
import { SERVICE_TYPES } from '../../constants/serviceTypes';
import { Job } from '../../types/booking.types';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { jobsApi } from '../../services/api/jobs.api';
import { mapApiJobToUiJob } from '../../utils/apiMappers';
import { ErrorState } from '../../components/ui/ErrorState';

/** Khoảng cách (km) giữa 2 điểm theo Haversine */
function getDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number | undefined,
  lng2: number | undefined
): number | undefined {
  if (lat2 == null || lng2 == null || (lat2 === 0 && lng2 === 0)) return undefined;
  const R = 6371; // bán kính Trái Đất km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // 1 chữ số thập phân
}

export default function HomeScreen() {
  const { user } = useAuthStore();
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filteredJobs = jobs.filter((job) => {
    if (!isAvailable) return false;
    if (selectedServiceType && job.serviceType !== selectedServiceType) return false;
    return job.status === 'OPEN';
  });

  const loadJobs = async () => {
    if (!isAvailable) {
      setJobs([]);
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMessage('Cần quyền truy cập vị trí để xem ca gần bạn. Trên web: bấm icon ổ khóa bên trái URL → Cài đặt trang → Vị trí → Cho phép.');
        setJobs([]);
        return;
      }

      const position = await Location.getCurrentPositionAsync({});
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      console.log('[Location] Vị trí hiện tại (dùng để tìm ca gần bạn):', {
        lat,
        lng,
        label: `https://www.google.com/maps?q=${lat},${lng}`,
      });

      const list = await jobsApi.findNearby(lat, lng, 10);
      const safeList = Array.isArray(list) ? list : [];
      const mapped = safeList.map(mapApiJobToUiJob).map((j) => ({
        ...j,
        distance: getDistanceKm(lat, lng, j.location?.latitude, j.location?.longitude),
      }));
      setJobs(mapped);

      mapped.forEach((job, i) => {
        console.log(`[Location] Ca #${i + 1} (${job.id}):`, {
          address: job.location?.address || '(không có địa chỉ)',
          lat: job.location?.latitude,
          lng: job.location?.longitude,
          mapUrl:
            job.location?.latitude != null && job.location?.longitude != null
              ? `https://www.google.com/maps?q=${job.location.latitude},${job.location.longitude}`
              : null,
        });
      });
    } catch (error: any) {
      setErrorMessage(error?.message || 'Không thể tải danh sách ca làm việc.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadJobs();
    setRefreshing(false);
  };

  useEffect(() => {
    loadJobs();
  }, [isAvailable]);

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <StatusBar style="dark" />
      
      {/* Header */}
      <View className="bg-white px-6 pt-6 pb-5 border-b border-slate-100">
        <Text className="text-2xl font-semibold text-slate-900">
          Chào mừng, {user?.fullName || 'CarePro'}
        </Text>
        <Text className="text-slate-600 mt-1 text-sm">
          Tìm ca làm việc phù hợp với bạn
        </Text>
      </View>

      {/* Toggle Available */}
      <View className="mx-4 mt-4 bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex-row items-center justify-between">
        <View className="flex-1 pr-4">
          <Text className="text-base font-semibold text-slate-900">
            Trạng thái nhận ca
          </Text>
          <Text className="text-sm text-slate-600 mt-1">
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
        <View className="mx-4 mt-4 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <Text className="text-base font-semibold text-slate-900 mb-3">
            Lọc theo loại dịch vụ
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              <TouchableOpacity
                className={`px-4 py-2 rounded-full ${
                  selectedServiceType === null
                    ? 'bg-blue-600'
                    : 'bg-slate-100'
                }`}
                onPress={() => setSelectedServiceType(null)}
              >
                <Text
                  className={`text-sm ${
                    selectedServiceType === null
                      ? 'text-white font-semibold'
                      : 'text-slate-700'
                  }`}
                >
                  Tất cả
                </Text>
              </TouchableOpacity>
              {SERVICE_TYPES.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  className={`px-4 py-2 rounded-full ${
                    selectedServiceType === service.id
                      ? 'bg-blue-600'
                      : 'bg-slate-100'
                  }`}
                  onPress={() => setSelectedServiceType(service.id)}
                >
                  <Text
                    className={`text-sm ${
                      selectedServiceType === service.id
                        ? 'text-white font-semibold'
                        : 'text-slate-700'
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
        <View className="mx-4 mt-4 mb-6">
          <Text className="text-lg font-semibold text-slate-900 mb-4">
            Ca làm việc gần bạn ({filteredJobs.length})
          </Text>
          {errorMessage ? (
            <ErrorState message={errorMessage} onRetry={loadJobs} />
          ) : loading ? (
            <View className="bg-white rounded-2xl p-8 items-center border border-slate-100">
              <Text className="text-slate-600 text-center text-sm">Đang tải dữ liệu...</Text>
            </View>
          ) : filteredJobs.length === 0 ? (
            <View className="bg-white rounded-2xl p-8 items-center border border-slate-100">
              <View className="w-12 h-12 rounded-full bg-blue-50 mb-4" />
              <Text className="text-slate-900 text-lg font-semibold mb-2 text-center">
                Không tìm thấy ca nào
              </Text>
              <Text className="text-slate-600 text-center text-sm">
                Hãy thử điều chỉnh bộ lọc hoặc kiểm tra lại sau
              </Text>
            </View>
          ) : (
            <View className="gap-4">
              {filteredJobs.map((job) => (
                <TouchableOpacity
                  key={job.id}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
                  onPress={() => router.push(`/job/${job.id}`)}
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-slate-900 mb-1">
                        {SERVICE_TYPES.find((s) => s.id === job.serviceType)?.name}
                      </Text>
                      <Text className="text-sm text-slate-600 mb-2" numberOfLines={2}>
                        {job.description}
                      </Text>
                    </View>
                    {job.fitScore && (
                      <View className="bg-emerald-50 px-3 py-1 rounded-full">
                        <Text className="text-emerald-700 text-xs font-semibold">
                          {job.fitScore}% phù hợp
                        </Text>
                      </View>
                    )}
                  </View>

                  <View className="flex-row flex-wrap items-center gap-3 mb-3">
                    {typeof job.distance === 'number' && (
                      <Text className="text-sm text-slate-600">Khoảng cách {job.distance} km</Text>
                    )}
                    <Text className="text-sm text-slate-600">
                      {job.budgetMin > 0 || job.budgetMax > 0
                        ? `Thu nhập ${job.budgetMin.toLocaleString('vi-VN')} - ${job.budgetMax.toLocaleString('vi-VN')}đ/h`
                        : 'Thu nhập thỏa thuận'}
                    </Text>
                  </View>

                  <View className="flex-row items-center justify-between pt-3 border-t border-slate-100">
                    <Text className="text-sm text-slate-600">
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
                      className="bg-blue-600 px-5 py-2 rounded-full"
                      onPress={() => router.push(`/job/${job.id}`)}
                    >
                      <Text className="text-white text-sm font-semibold">Xem chi tiết</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ) : (
        <View className="mx-4 mt-6 items-center bg-white rounded-2xl p-8 border border-slate-100">
          <View className="w-12 h-12 rounded-full bg-slate-100 mb-4" />
          <Text className="text-slate-600 text-center text-base">
            Bạn đang tạm dừng nhận ca.{'\n'}Bật lại để xem các ca làm việc.
          </Text>
        </View>
      )}
      </ScrollView>
    </SafeAreaView>
  );
}


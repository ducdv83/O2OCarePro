import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { jobsApi } from '../../../services/api/jobs.api';
import { proposalsApi } from '../../../services/api/proposals.api';
import { Job } from '../../../types/booking.types';
import { mapApiJobToUiJob } from '../../../utils/apiMappers';
import { ErrorState } from '../../../components/ui/ErrorState';

export default function ProposePriceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [proposedRate, setProposedRate] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingJob, setLoadingJob] = useState(false);

  const loadJob = async () => {
    if (!id) return;
    setLoadingJob(true);
    setErrorMessage(null);
    try {
      const response = await jobsApi.findOne(id);
      setJob(mapApiJobToUiJob(response));
    } catch (error: any) {
      setErrorMessage(error?.message || 'Không thể tải thông tin ca làm việc.');
      setJob(null);
    } finally {
      setLoadingJob(false);
    }
  };

  useEffect(() => {
    loadJob();
  }, [id]);

  if (loadingJob && !job) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-600">Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-6">
        <ErrorState message={errorMessage} onRetry={loadJob} />
      </View>
    );
  }

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

  const handleSubmit = async () => {
    const rate = parseInt(proposedRate);
    
    if (!proposedRate || isNaN(rate)) {
      Alert.alert('Lỗi', 'Vui lòng nhập giá đề nghị');
      return;
    }

    const hasBudgetRange = job.budgetMin > 0 || job.budgetMax > 0;
    if (hasBudgetRange && (rate < job.budgetMin || rate > job.budgetMax)) {
      Alert.alert(
        'Cảnh báo',
        `Giá đề nghị nên nằm trong khung ${job.budgetMin.toLocaleString('vi-VN')} - ${job.budgetMax.toLocaleString('vi-VN')}đ/h. Bạn có chắc muốn tiếp tục?`,
        [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Tiếp tục', onPress: () => submitProposal(rate) },
        ]
      );
      return;
    }

    submitProposal(rate);
  };

  const submitProposal = async (rate: number) => {
    setLoading(true);
    
    try {
      await proposalsApi.create({
        job_id: job.id,
        proposed_rate: rate,
        message: message || undefined,
      });
      Alert.alert(
        'Thành công',
        'Đề nghị của bạn đã được gửi. Khách hàng sẽ xem xét và phản hồi sớm nhất.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)/bookings'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Lỗi', error?.message || 'Không thể gửi đề nghị. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const isOutOfRange = () => {
    const rate = parseInt(proposedRate);
    if (isNaN(rate)) return false;
    if (job.budgetMin <= 0 && job.budgetMax <= 0) return false;
    return rate < job.budgetMin || rate > job.budgetMax;
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
          Đề nghị giá
        </Text>
      </View>

      {/* Info */}
      <View className="bg-white mt-2 px-6 py-6">
        <View className="mb-4">
          <Text className="text-base font-semibold text-gray-900 mb-2">Khung giá</Text>
          {job.budgetMin > 0 || job.budgetMax > 0 ? (
            <Text className="text-gray-700 text-lg">
              {job.budgetMin.toLocaleString('vi-VN')} - {job.budgetMax.toLocaleString('vi-VN')}đ/h
            </Text>
          ) : (
            <Text className="text-gray-700 text-lg">Thỏa thuận</Text>
          )}
        </View>

        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-900 mb-2">
            Giá đề nghị của bạn (đ/h) *
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
            placeholder={job.budgetMin > 0 ? job.budgetMin.toString() : 'Nhập mức giá'}
            value={proposedRate}
            onChangeText={setProposedRate}
            keyboardType="number-pad"
          />
          {isOutOfRange() && (
            <View className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <Text className="text-yellow-800 text-sm">
                ⚠️ Giá đề nghị nằm ngoài khung giá. Khách hàng có thể từ chối.
              </Text>
            </View>
          )}
        </View>

        <View className="mb-4">
          <Text className="text-base font-semibold text-gray-900 mb-2">
            Lời nhắn (tùy chọn)
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 h-24"
            placeholder="Giới thiệu về kinh nghiệm của bạn hoặc lý do bạn phù hợp với ca này..."
            value={message}
            onChangeText={setMessage}
            multiline
            textAlignVertical="top"
          />
        </View>
      </View>

      {/* Actions */}
      <View className="px-6 py-4 gap-3">
        <TouchableOpacity
          className={`bg-blue-500 rounded-lg py-4 items-center ${loading ? 'opacity-50' : ''}`}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text className="text-white text-lg font-semibold">
            {loading ? 'Đang gửi...' : 'Gửi đề nghị'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white border-2 border-gray-300 rounded-lg py-4 items-center"
          onPress={() => router.back()}
        >
          <Text className="text-gray-700 text-lg font-semibold">Hủy</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


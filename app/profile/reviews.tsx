import { View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { format } from 'date-fns';

interface Review {
  id: string;
  raterName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

const mockReviews: Review[] = [
  {
    id: '1',
    raterName: 'Nguyễn Văn A',
    rating: 5,
    comment: 'Rất chuyên nghiệp, chăm sóc tận tình. Cảm ơn bạn rất nhiều!',
    createdAt: new Date('2024-02-10'),
  },
  {
    id: '2',
    raterName: 'Trần Thị B',
    rating: 5,
    comment: 'Điều dưỡng viên có kinh nghiệm, biết cách chăm sóc người già. Rất hài lòng.',
    createdAt: new Date('2024-02-05'),
  },
  {
    id: '3',
    raterName: 'Lê Văn C',
    rating: 4,
    comment: 'Tốt, nhưng có thể cải thiện thêm về giao tiếp.',
    createdAt: new Date('2024-01-28'),
  },
];

export default function ReviewsScreen() {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Text key={index} className="text-lg">
        {index < rating ? '⭐' : '☆'}
      </Text>
    ));
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
          Đánh giá đã nhận
        </Text>
      </View>

      {/* Summary */}
      <View className="bg-white mt-2 px-6 py-6 items-center">
        <View className="flex-row items-center mb-2">
          <Text className="text-4xl font-bold text-gray-900 mr-2">4.8</Text>
          <View className="flex-row">{renderStars(5)}</View>
        </View>
        <Text className="text-gray-600">24 đánh giá</Text>
      </View>

      {/* Reviews List */}
      <View className="px-6 py-4">
        {mockReviews.map((review) => (
          <View
            key={review.id}
            className="bg-white rounded-lg p-4 mb-4 shadow-sm"
          >
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 mb-1">
                  {review.raterName}
                </Text>
                <View className="flex-row items-center">
                  {renderStars(review.rating)}
                </View>
              </View>
              <Text className="text-gray-500 text-sm">
                {format(review.createdAt, 'dd/MM/yyyy')}
              </Text>
            </View>
            <Text className="text-gray-700 leading-5">{review.comment}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}


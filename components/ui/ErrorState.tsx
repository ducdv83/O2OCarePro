import { View, Text, TouchableOpacity } from 'react-native';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Có lỗi xảy ra',
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <View className="bg-white rounded-lg p-8 items-center">
      <Text className="text-5xl mb-4">⚠️</Text>
      <Text className="text-gray-900 text-lg font-semibold mb-2 text-center">
        {title}
      </Text>
      <Text className="text-gray-600 text-center text-sm mb-6">
        {message}
      </Text>
      {onRetry && (
        <TouchableOpacity
          className="bg-blue-500 px-6 py-3 rounded-lg"
          onPress={onRetry}
        >
          <Text className="text-white font-semibold">Thử lại</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}


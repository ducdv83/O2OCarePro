import { View, Text, TouchableOpacity } from 'react-native';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = '📭',
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="bg-white rounded-lg p-8 items-center">
      <Text className="text-5xl mb-4">{icon}</Text>
      <Text className="text-gray-900 text-lg font-semibold mb-2 text-center">
        {title}
      </Text>
      {description && (
        <Text className="text-gray-600 text-center text-sm mb-6">
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <TouchableOpacity
          className="bg-blue-500 px-6 py-3 rounded-lg"
          onPress={onAction}
        >
          <Text className="text-white font-semibold">{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}


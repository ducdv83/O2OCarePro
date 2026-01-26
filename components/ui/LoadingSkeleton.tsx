import { View } from 'react-native';

interface LoadingSkeletonProps {
  width?: string | number;
  height?: number;
  borderRadius?: number;
}

export function LoadingSkeleton({
  width = '100%',
  height = 20,
  borderRadius = 4,
}: LoadingSkeletonProps) {
  return (
    <View
      className="bg-gray-200 animate-pulse"
      style={{
        width,
        height,
        borderRadius,
      }}
    />
  );
}

export function JobCardSkeleton() {
  return (
    <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <LoadingSkeleton width="60%" height={24} borderRadius={4} />
          <View className="mt-2">
            <LoadingSkeleton width="100%" height={16} />
            <LoadingSkeleton width="80%" height={16} className="mt-1" />
          </View>
        </View>
        <LoadingSkeleton width={60} height={24} borderRadius={12} />
      </View>
      <View className="flex-row gap-4 mt-3">
        <LoadingSkeleton width={80} height={16} />
        <LoadingSkeleton width={120} height={16} />
      </View>
      <View className="mt-3 pt-3 border-t border-gray-200">
        <LoadingSkeleton width="40%" height={16} />
      </View>
    </View>
  );
}

export function BookingCardSkeleton() {
  return (
    <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
      <View className="flex-row justify-between items-center mb-3">
        <LoadingSkeleton width="50%" height={20} />
        <LoadingSkeleton width={80} height={24} borderRadius={12} />
      </View>
      <View className="gap-2">
        <LoadingSkeleton width="70%" height={16} />
        <LoadingSkeleton width="60%" height={16} />
        <LoadingSkeleton width="40%" height={16} />
      </View>
    </View>
  );
}


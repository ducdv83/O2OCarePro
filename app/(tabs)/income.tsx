import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { formatCurrency } from '../../utils/format';

export default function IncomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

interface IncomeData {
  available: number; // Số dư khả dụng
  escrow: number; // Đang tạm giữ
  totalEarned: number; // Tổng đã kiếm (tháng này)
}

const mockIncome: IncomeData = {
  available: 2500000,
  escrow: 500000,
  totalEarned: 8500000,
};

const mockTransactions = [
  {
    id: '1',
    type: 'EARNED',
    amount: 2500000,
    description: 'Ca chăm sóc người già - 15/02',
    date: new Date('2024-02-15'),
    status: 'COMPLETED',
  },
  {
    id: '2',
    type: 'EARNED',
    amount: 1800000,
    description: 'Ca trông trẻ - 14/02',
    date: new Date('2024-02-14'),
    status: 'COMPLETED',
  },
  {
    id: '3',
    type: 'PAYOUT',
    amount: -2000000,
    description: 'Rút tiền về tài khoản',
    date: new Date('2024-02-10'),
    status: 'PROCESSING',
  },
];

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="bg-white px-6 py-4">
        <Text className="text-2xl font-bold text-gray-900">
          Thu nhập
        </Text>
      </View>

      {/* Balance Cards */}
      <View className="px-6 py-4 gap-4">
        {/* Available Balance */}
        <View className="bg-blue-500 rounded-lg p-6">
          <Text className="text-white text-sm mb-2">Số dư khả dụng</Text>
          <Text className="text-white text-3xl font-bold mb-4">
            {formatCurrency(mockIncome.available)}
          </Text>
          <TouchableOpacity
            className="bg-white rounded-lg py-3 items-center"
            onPress={() => router.push('/income/withdraw')}
          >
            <Text className="text-blue-500 font-semibold">Rút tiền</Text>
          </TouchableOpacity>
        </View>

        {/* Escrow Balance */}
        <View className="bg-orange-100 rounded-lg p-4">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-gray-600 text-sm mb-1">Đang tạm giữ</Text>
              <Text className="text-gray-900 text-xl font-semibold">
                {formatCurrency(mockIncome.escrow)}
              </Text>
            </View>
            <Text className="text-gray-500 text-xs">
              Sẽ được giải ngân sau khi{'\n'}khách hàng xác nhận
            </Text>
          </View>
        </View>

        {/* Monthly Summary */}
        <View className="bg-white rounded-lg p-4">
          <Text className="text-gray-600 text-sm mb-2">Thu nhập tháng này</Text>
          <Text className="text-gray-900 text-2xl font-bold">
            {formatCurrency(mockIncome.totalEarned)}
          </Text>
        </View>
      </View>

      {/* Transactions */}
      <View className="px-6 py-4">
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          Lịch sử giao dịch
        </Text>
        <View className="gap-3">
          {mockTransactions.map((transaction) => (
            <View
              key={transaction.id}
              className="bg-white rounded-lg p-4 flex-row justify-between items-center"
            >
              <View className="flex-1">
                <Text className="text-gray-900 font-medium mb-1">
                  {transaction.description}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {transaction.date.toLocaleDateString('vi-VN')}
                </Text>
              </View>
              <View className="items-end">
                <Text
                  className={`text-lg font-semibold ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transaction.amount > 0 ? '+' : ''}
                  {formatCurrency(Math.abs(transaction.amount))}
                </Text>
                <Text className="text-gray-500 text-xs mt-1">
                  {transaction.status === 'PROCESSING' ? 'Đang xử lý' : 'Hoàn tất'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View className="px-6 py-4">
        <TouchableOpacity
          className="bg-white rounded-lg p-4 flex-row items-center justify-between"
          onPress={() => router.push('/income/withdraw')}
        >
          <View className="flex-row items-center">
            <Text className="text-2xl mr-3">💳</Text>
            <View>
              <Text className="text-gray-900 font-medium">Rút tiền</Text>
              <Text className="text-gray-500 text-sm">Thêm tài khoản ngân hàng</Text>
            </View>
          </View>
          <Text className="text-gray-400">›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


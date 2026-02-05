import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { formatCurrency } from '../../utils/format';
import { SafeAreaView } from 'react-native-safe-area-context';

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  type: 'BANK' | 'MOMO' | 'ZALOPAY';
}

const mockBankAccounts: BankAccount[] = [
  {
    id: '1',
    bankName: 'Vietcombank',
    accountNumber: '1234567890',
    accountName: 'NGUYEN THI B',
    type: 'BANK',
  },
];

export default function WithdrawScreen() {
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(
    mockBankAccounts[0] || null
  );
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const availableBalance = 2500000;
  const withdrawFee = 0; // 0% fee for now
  const minWithdraw = 100000;

  const handleWithdraw = async () => {
    const withdrawAmount = parseInt(amount);

    if (!selectedAccount) {
      Alert.alert('Lỗi', 'Vui lòng chọn tài khoản nhận tiền');
      return;
    }

    if (!amount || isNaN(withdrawAmount)) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tiền');
      return;
    }

    if (withdrawAmount < minWithdraw) {
      Alert.alert('Lỗi', `Số tiền tối thiểu là ${formatCurrency(minWithdraw)}`);
      return;
    }

    if (withdrawAmount > availableBalance) {
      Alert.alert('Lỗi', 'Số dư không đủ');
      return;
    }

    setLoading(true);
    // Mock withdraw
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Thành công',
        `Yêu cầu rút ${formatCurrency(withdrawAmount)} đã được gửi. Tiền sẽ được chuyển trong vòng 1-3 ngày làm việc.`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
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
          Rút tiền
        </Text>
      </View>

      <ScrollView className="flex-1">
        {/* Balance Info */}
        <View className="bg-white px-6 py-6">
          <Text className="text-slate-600 text-sm mb-2">Số dư khả dụng</Text>
          <Text className="text-3xl font-semibold text-slate-900 mb-3">
          {formatCurrency(availableBalance)}
          </Text>
          <Text className="text-slate-500 text-sm">
            Số tiền tối thiểu: {formatCurrency(minWithdraw)}
          </Text>
        </View>

        {/* Bank Account Selection */}
        <View className="bg-white mt-2 px-6 py-6">
          <Text className="text-base font-semibold text-slate-900 mb-4">
            Tài khoản nhận tiền
          </Text>
          {mockBankAccounts.length > 0 ? (
            <View className="gap-3">
              {mockBankAccounts.map((account) => (
                <TouchableOpacity
                  key={account.id}
                  className={`border rounded-xl p-4 ${
                    selectedAccount?.id === account.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 bg-white'
                  }`}
                  onPress={() => setSelectedAccount(account)}
                >
                  <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                      <Text className="text-slate-900 font-semibold mb-1">
                        {account.bankName}
                      </Text>
                      <Text className="text-slate-600 text-sm">
                        {account.accountNumber}
                      </Text>
                      <Text className="text-slate-600 text-sm">
                        {account.accountName}
                      </Text>
                    </View>
                    {selectedAccount?.id === account.id && (
                      <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center">
                        <Text className="text-white text-xs">✓</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <TouchableOpacity
              className="border border-dashed border-slate-300 rounded-xl p-6 items-center"
              onPress={() => {
                Alert.alert('Thông báo', 'Tính năng thêm tài khoản sẽ được phát triển sau');
              }}
            >
              <Text className="text-slate-600">Thêm tài khoản ngân hàng</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Amount Input */}
        <View className="bg-white mt-2 px-6 py-6">
          <Text className="text-base font-semibold text-slate-900 mb-4">
            Số tiền muốn rút
          </Text>
          <TextInput
            className="border border-slate-300 rounded-xl px-4 py-4 text-2xl font-semibold"
            placeholder="0"
            value={amount}
            onChangeText={setAmount}
            keyboardType="number-pad"
          />
          <View className="flex-row flex-wrap gap-2 mt-3">
            {[500000, 1000000, 2000000, availableBalance].map((value) => (
              <TouchableOpacity
                key={value}
                className="bg-slate-100 px-4 py-2 rounded-full"
                onPress={() => setAmount(value.toString())}
              >
                <Text className="text-slate-700 text-sm">
                  {formatCurrency(value)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {amount && !isNaN(parseInt(amount)) && (
            <View className="mt-4 pt-4 border-t border-slate-200">
              <View className="flex-row justify-between mb-2">
                <Text className="text-slate-600">Phí rút tiền</Text>
                <Text className="text-slate-900">{formatCurrency(0)}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-slate-900 font-semibold">Số tiền nhận được</Text>
                <Text className="text-blue-600 font-bold text-lg">
                  {formatCurrency(parseInt(amount) - withdrawFee)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Submit Button */}
        <View className="px-6 py-6">
          <TouchableOpacity
            className={`bg-blue-600 rounded-xl py-4 items-center ${loading ? 'opacity-50' : ''}`}
            onPress={handleWithdraw}
            disabled={loading}
          >
            <Text className="text-white text-lg font-semibold">
              {loading ? 'Đang xử lý...' : 'Xác nhận rút tiền'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


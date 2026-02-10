import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { layout } from '../../constants/layout';

export default function EKYCScreen() {
  const [cccdFront, setCccdFront] = useState<string | null>(null);
  const [cccdBack, setCccdBack] = useState<string | null>(null);
  const [certificates, setCertificates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const pickImage = async (type: 'front' | 'back' | 'certificate') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 10],
      quality: 0.8,
    });

    if (!result.canceled) {
      if (type === 'front') {
        setCccdFront(result.assets[0].uri);
      } else if (type === 'back') {
        setCccdBack(result.assets[0].uri);
      } else {
        setCertificates([...certificates, result.assets[0].uri]);
      }
    }
  };

  const removeCertificate = (index: number) => {
    setCertificates(certificates.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!cccdFront || !cccdBack) {
      Alert.alert('Lỗi', 'Vui lòng upload đầy đủ ảnh CCCD mặt trước và mặt sau');
      return;
    }

    setLoading(true);
    // Mock eKYC submission
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Đã gửi',
        'Hồ sơ của bạn đang được xét duyệt. Chúng tôi sẽ thông báo kết quả trong vòng 24-48 giờ.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(auth)/quiz'),
          },
        ]
      );
    }, 1000);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'bottom']}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: layout.scrollBottomPadding }}
        keyboardShouldPersistTaps="handled"
      >
        <StatusBar style="dark" />
        <View style={{ paddingHorizontal: layout.horizontalPadding, paddingTop: 24, paddingBottom: 32 }}>
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Xác thực danh tính (eKYC)
        </Text>
        <Text className="text-base text-gray-600 mb-8">
          Vui lòng upload ảnh CCCD để xác thực danh tính của bạn
        </Text>

        {/* CCCD Front */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-900 mb-3">
            CCCD mặt trước *
          </Text>
          <TouchableOpacity
            onPress={() => pickImage('front')}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 items-center"
          >
            {cccdFront ? (
              <Image source={{ uri: cccdFront }} className="w-full h-48 rounded-lg" />
            ) : (
              <>
                <Text className="text-4xl mb-2">📄</Text>
                <Text className="text-gray-600">Chạm để chọn ảnh</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* CCCD Back */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-900 mb-3">
            CCCD mặt sau *
          </Text>
          <TouchableOpacity
            onPress={() => pickImage('back')}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 items-center"
          >
            {cccdBack ? (
              <Image source={{ uri: cccdBack }} className="w-full h-48 rounded-lg" />
            ) : (
              <>
                <Text className="text-4xl mb-2">📄</Text>
                <Text className="text-gray-600">Chạm để chọn ảnh</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Certificates */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-900 mb-3">
            Chứng chỉ (tùy chọn)
          </Text>
          <TouchableOpacity
            onPress={() => pickImage('certificate')}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 items-center mb-3"
          >
            <Text className="text-2xl mb-2">➕</Text>
            <Text className="text-gray-600">Thêm chứng chỉ</Text>
          </TouchableOpacity>

          {certificates.map((cert, index) => (
            <View key={index} className="mb-3 relative">
              <Image source={{ uri: cert }} className="w-full h-48 rounded-lg" />
              <TouchableOpacity
                onPress={() => removeCertificate(index)}
                className="absolute top-2 right-2 bg-red-500 rounded-full w-8 h-8 items-center justify-center"
              >
                <Text className="text-white font-bold">×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity
          className={`bg-blue-500 py-4 rounded-lg items-center mt-4 mb-8 ${loading ? 'opacity-50' : ''}`}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text className="text-white text-lg font-semibold">
            {loading ? 'Đang gửi...' : 'Gửi để xét duyệt'}
          </Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


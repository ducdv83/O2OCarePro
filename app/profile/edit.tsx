import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { SERVICE_TYPES, SKILLS } from '../../constants/serviceTypes';
import { useAuthStore } from '../../store/auth.store';

export default function EditProfileScreen() {
  const { user } = useAuthStore();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [bio, setBio] = useState('Tôi là điều dưỡng viên với 5 năm kinh nghiệm chăm sóc người già và bệnh nhân.');
  const [yearsExp, setYearsExp] = useState('5');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Tiêm thuốc', 'Sơ cứu', 'Chăm sóc người già']);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>(['elderly', 'patient']);
  const [hourlyRate, setHourlyRate] = useState('250000');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const toggleServiceType = (type: string) => {
    if (selectedServiceTypes.includes(type)) {
      setSelectedServiceTypes(selectedServiceTypes.filter((t) => t !== type));
    } else {
      setSelectedServiceTypes([...selectedServiceTypes, type]);
    }
  };

  const handleSave = async () => {
    if (!fullName || !bio || !yearsExp || selectedSkills.length === 0 || selectedServiceTypes.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    // Mock save profile
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Thành công', 'Đã cập nhật hồ sơ thành công', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    }, 1000);
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
          Chỉnh sửa hồ sơ
        </Text>
      </View>

      <View className="px-6 py-6">
        {/* Avatar */}
        <View className="items-center mb-6">
          <TouchableOpacity onPress={pickImage}>
            {avatar ? (
              <Image source={{ uri: avatar }} className="w-24 h-24 rounded-full" />
            ) : (
              <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center">
                <Text className="text-4xl">📷</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text className="text-sm text-gray-600 mt-2">Chạm để chọn ảnh đại diện</Text>
        </View>

        {/* Full Name */}
        <View className="mb-6">
          <Text className="text-sm text-gray-700 mb-2">Họ và tên *</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 bg-white"
            placeholder="Nguyễn Thị B"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        {/* Bio */}
        <View className="mb-6">
          <Text className="text-sm text-gray-700 mb-2">Giới thiệu bản thân *</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 h-24 bg-white"
            placeholder="Mô tả về kinh nghiệm và chuyên môn của bạn..."
            value={bio}
            onChangeText={setBio}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Years of Experience */}
        <View className="mb-6">
          <Text className="text-sm text-gray-700 mb-2">Số năm kinh nghiệm *</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 bg-white"
            placeholder="5"
            value={yearsExp}
            onChangeText={setYearsExp}
            keyboardType="number-pad"
          />
        </View>

        {/* Hourly Rate */}
        <View className="mb-6">
          <Text className="text-sm text-gray-700 mb-2">Giá tham khảo (đ/h) *</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 bg-white"
            placeholder="250000"
            value={hourlyRate}
            onChangeText={setHourlyRate}
            keyboardType="number-pad"
          />
        </View>

        {/* Service Types */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-900 mb-3">
            Loại dịch vụ bạn cung cấp *
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {SERVICE_TYPES.map((service) => (
              <TouchableOpacity
                key={service.id}
                className={`px-4 py-3 rounded-lg border-2 ${
                  selectedServiceTypes.includes(service.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-white'
                }`}
                onPress={() => toggleServiceType(service.id)}
              >
                <Text className="text-2xl text-center mb-1">
                  {service.icon}
                </Text>
                <Text
                  className={`text-center text-sm ${
                    selectedServiceTypes.includes(service.id)
                      ? 'text-blue-700 font-semibold'
                      : 'text-gray-700'
                  }`}
                >
                  {service.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Skills */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-900 mb-3">
            Kỹ năng của bạn *
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {SKILLS.map((skill) => (
              <TouchableOpacity
                key={skill}
                className={`px-4 py-2 rounded-full border ${
                  selectedSkills.includes(skill)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-white'
                }`}
                onPress={() => toggleSkill(skill)}
              >
                <Text
                  className={`text-sm ${
                    selectedSkills.includes(skill)
                      ? 'text-blue-700 font-semibold'
                      : 'text-gray-700'
                  }`}
                >
                  {skill}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          className={`bg-blue-500 py-4 rounded-lg items-center mt-4 mb-8 ${loading ? 'opacity-50' : ''}`}
          onPress={handleSave}
          disabled={loading}
        >
          <Text className="text-white text-lg font-semibold">
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


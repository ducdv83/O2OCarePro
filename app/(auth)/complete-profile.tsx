import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { SERVICE_TYPES, SKILLS } from '../../constants/serviceTypes';
import { layout } from '../../constants/layout';

export default function CompleteProfileScreen() {
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [yearsExp, setYearsExp] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([]);
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

  const [errors, setErrors] = useState<{
    fullName?: string;
    bio?: string;
    yearsExp?: string;
    skills?: string;
    serviceTypes?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    
    if (!fullName || fullName.trim().length < 2) {
      newErrors.fullName = 'Họ và tên phải có ít nhất 2 ký tự';
    }
    
    if (!bio || bio.trim().length < 10) {
      newErrors.bio = 'Giới thiệu phải có ít nhất 10 ký tự';
    }
    
    if (!yearsExp || isNaN(parseInt(yearsExp)) || parseInt(yearsExp) < 0) {
      newErrors.yearsExp = 'Vui lòng nhập số năm kinh nghiệm hợp lệ';
    }
    
    if (selectedSkills.length === 0) {
      newErrors.skills = 'Vui lòng chọn ít nhất 1 kỹ năng';
    }
    
    if (selectedServiceTypes.length === 0) {
      newErrors.serviceTypes = 'Vui lòng chọn ít nhất 1 loại dịch vụ';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    setLoading(true);
    // Mock save profile
    setTimeout(() => {
      setLoading(false);
      router.replace('/(auth)/ekyc');
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
          Hoàn thiện hồ sơ
        </Text>
        <Text className="text-base text-gray-600 mb-8">
          Thông tin này sẽ giúp khách hàng tìm thấy bạn dễ dàng hơn
        </Text>

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
            className="border border-gray-300 rounded-lg px-4 py-3"
            placeholder="Nguyễn Thị B"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        {/* Bio */}
        <View className="mb-6">
          <Text className="text-sm text-gray-700 mb-2">Giới thiệu bản thân *</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 h-24"
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
            className="border border-gray-300 rounded-lg px-4 py-3"
            placeholder="5"
            value={yearsExp}
            onChangeText={setYearsExp}
            keyboardType="number-pad"
          />
        </View>

        {/* Service Types */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-900 mb-3">
            Loại dịch vụ bạn cung cấp *
          </Text>
          {errors.serviceTypes && (
            <Text className="text-red-500 text-xs mb-2">{errors.serviceTypes}</Text>
          )}
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
          {errors.skills && (
            <Text className="text-red-500 text-xs mb-2">{errors.skills}</Text>
          )}
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
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text className="text-white text-lg font-semibold">
            {loading ? 'Đang lưu...' : 'Tiếp tục'}
          </Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


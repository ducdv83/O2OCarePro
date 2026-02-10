import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authApi } from '../../services/api/auth.api';
import { useAuthStore } from '../../store/auth.store';
import { layout } from '../../constants/layout';

const GENDER_OPTIONS = [
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'other', label: 'Khác' },
] as const;

export default function RegisterScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<string>('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);

  const handleRegister = async () => {
    setErrorMessage('');
    if (!phone || phone.length < 10) {
      setErrorMessage('Vui lòng nhập số điện thoại hợp lệ');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (!fullName || fullName.trim().length < 2) {
      setErrorMessage('Vui lòng nhập họ và tên (ít nhất 2 ký tự)');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.register({
        phone,
        password,
        full_name: fullName.trim(),
        email: email.trim() || undefined,
        gender: gender || undefined,
        address: address.trim() || undefined,
      });
      setToken(response.token);
      setUser({
        id: response.user.id,
        phone: response.user.phone,
        role: response.user.role,
        fullName: response.user.full_name,
      });
      router.replace('/(auth)/complete-profile');
    } catch (error: any) {
      const msg = Array.isArray(error?.message) ? error.message[0] : error?.message;
      setErrorMessage(msg || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setErrorMessage('');

  const paddingHorizontal = layout.horizontalPadding;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal, paddingBottom: layout.scrollBottomPadding },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formBlock}>
            <Text style={styles.title}>Tạo tài khoản CarePro</Text>
            <Text style={styles.subtitle}>Điền thông tin để đăng ký</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Số điện thoại (tên đăng nhập) *</Text>
              <TextInput
                style={styles.input}
                placeholder="0901234567"
                value={phone}
                onChangeText={(t) => { setPhone(t); clearError(); }}
                keyboardType="phone-pad"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Mật khẩu *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ít nhất 6 ký tự"
                value={password}
                onChangeText={(t) => { setPassword(t); clearError(); }}
                secureTextEntry
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Họ và tên *</Text>
              <TextInput
                style={styles.input}
                placeholder="Nguyễn Văn A"
                value={fullName}
                onChangeText={(t) => { setFullName(t); clearError(); }}
                autoCapitalize="words"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="email@example.com"
                value={email}
                onChangeText={(t) => { setEmail(t); clearError(); }}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Giới tính</Text>
              <View style={styles.genderRow}>
                {GENDER_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => { setGender(opt.value); clearError(); }}
                    style={[
                      styles.genderBtn,
                      gender === opt.value && styles.genderBtnActive,
                    ]}
                  >
                    <Text style={[styles.genderText, gender === opt.value && styles.genderTextActive]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Địa chỉ</Text>
              <TextInput
                style={styles.input}
                placeholder="Số nhà, đường, quận, thành phố"
                value={address}
                onChangeText={(t) => { setAddress(t); clearError(); }}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {errorMessage ? (
              <Text style={styles.error}>{errorMessage}</Text>
            ) : null}

            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.btnText}>
                {loading ? 'Đang xử lý...' : 'Đăng ký'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
              <Text style={styles.backText}>Quay lại</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboard: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 20,
  },
  formBlock: {
    paddingBottom: 32,
    maxWidth: layout.formMaxWidth,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  field: {
    marginBottom: layout.formGroupGap,
  },
  label: {
    fontSize: 14,
    color: '#374151',
    marginBottom: layout.labelInputGap,
    fontWeight: '500',
  },
  input: {
    minHeight: layout.inputMinHeight,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: layout.inputBorderRadius,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#fff',
  },
  genderRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  genderBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: layout.inputBorderRadius,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
  },
  genderBtnActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  genderText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  genderTextActive: {
    color: '#fff',
  },
  error: {
    fontSize: 14,
    color: '#DC2626',
    marginBottom: 16,
  },
  btn: {
    height: layout.buttonHeight,
    backgroundColor: '#3B82F6',
    borderRadius: layout.inputBorderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  backBtn: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 8,
  },
  backText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '500',
  },
});

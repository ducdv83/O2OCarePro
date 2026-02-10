import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authApi } from '../../services/api/auth.api';
import { useAuthStore } from '../../store/auth.store';
import { layout } from '../../constants/layout';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);

  const handleLogin = async () => {
    setErrorMessage('');
    if (!phone || phone.length < 10) {
      setErrorMessage('Vui lòng nhập số điện thoại hợp lệ');
      return;
    }
    if (!password) {
      setErrorMessage('Vui lòng nhập mật khẩu');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.login(phone, password);
      setToken(response.token);
      setUser({
        id: response.user.id,
        phone: response.user.phone,
        role: response.user.role,
        fullName: response.user.full_name,
      });
      router.replace('/(tabs)');
    } catch (error: any) {
      const msg = Array.isArray(error?.message) ? error.message[0] : error?.message;
      setErrorMessage(msg || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const paddingHorizontal = layout.horizontalPadding;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.inner, { paddingHorizontal, maxWidth: layout.formMaxWidth }]}>
          <Text style={styles.title}>Đăng nhập</Text>
          <Text style={styles.subtitle}>Nhập số điện thoại và mật khẩu</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Số điện thoại (tên đăng nhập)</Text>
            <TextInput
              style={styles.input}
              placeholder="0901234567"
              value={phone}
              onChangeText={(t) => { setPhone(t); setErrorMessage(''); }}
              keyboardType="phone-pad"
              autoFocus
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              value={password}
              onChangeText={(t) => { setPassword(t); setErrorMessage(''); }}
              secureTextEntry
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={styles.backText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'center',
  },
  inner: {
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

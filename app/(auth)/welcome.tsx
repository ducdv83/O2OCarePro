import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { layout } from '../../constants/layout';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <View style={[styles.inner, { paddingHorizontal: layout.horizontalPadding }]}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>O2O</Text>
        </View>

        <Text style={styles.title}>
          Chào mừng đến với{'\n'}O2O CarePro
        </Text>

        <Text style={styles.subtitle}>
          Nền tảng kết nối bạn với các gia đình cần dịch vụ chăm sóc
        </Text>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => router.push('/(auth)/login')}
            activeOpacity={0.8}
          >
            <Text style={styles.btnPrimaryText}>Đăng nhập</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => router.push('/(auth)/register')}
            activeOpacity={0.8}
          >
            <Text style={styles.btnSecondaryText}>Tạo tài khoản</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: layout.formMaxWidth,
    alignSelf: 'center',
    width: '100%',
  },
  logo: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 48,
    paddingHorizontal: 16,
  },
  buttons: {
    width: '100%',
  },
  btnPrimary: {
    height: layout.buttonHeight,
    backgroundColor: '#3B82F6',
    borderRadius: layout.inputBorderRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  btnSecondary: {
    height: layout.buttonHeight,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderRadius: layout.inputBorderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  btnSecondaryText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#3B82F6',
  },
});


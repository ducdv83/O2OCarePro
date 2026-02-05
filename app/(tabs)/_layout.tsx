import { View } from 'react-native';
import { Tabs } from 'expo-router';

// Simple icon component - sẽ thay bằng react-native-vector-icons sau
function TabIcon({ color, focused }: { color: string; focused: boolean }) {
  return (
    <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: focused ? 10 : 8,
          height: focused ? 10 : 8,
          backgroundColor: color,
          borderRadius: 999,
        }}
      />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarStyle: {
          height: 72,
          paddingTop: 8,
          paddingBottom: 10,
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          shadowColor: '#000000',
          shadowOpacity: 0.06,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: -2 },
          elevation: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, focused }) => <TabIcon color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Ca đã nhận',
          tabBarIcon: ({ color, focused }) => <TabIcon color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="income"
        options={{
          title: 'Thu nhập',
          tabBarIcon: ({ color, focused }) => <TabIcon color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Cá nhân',
          tabBarIcon: ({ color, focused }) => <TabIcon color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}


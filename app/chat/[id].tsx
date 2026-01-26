import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { format } from 'date-fns';

interface Message {
  id: string;
  senderId: string;
  body: string;
  sentAt: Date;
  isMe: boolean;
}

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: 'client1',
    body: 'Xin chào, bạn có thể bắt đầu ca lúc 8h sáng được không?',
    sentAt: new Date('2024-02-14T07:00:00'),
    isMe: false,
  },
  {
    id: '2',
    senderId: 'carepro1',
    body: 'Chào bạn, tôi có thể bắt đầu đúng 8h sáng. Tôi sẽ đến đúng giờ.',
    sentAt: new Date('2024-02-14T07:05:00'),
    isMe: true,
  },
  {
    id: '3',
    senderId: 'client1',
    body: 'Cảm ơn bạn. Địa chỉ đã gửi trong thông tin ca rồi nhé.',
    sentAt: new Date('2024-02-14T07:10:00'),
    isMe: false,
  },
];

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'carepro1',
      body: inputText,
      sentAt: new Date(),
      isMe: true,
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="bg-white px-6 py-4 flex-row items-center border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>
        <View className="ml-4 flex-1">
          <Text className="text-lg font-semibold text-gray-900">
            Khách hàng
          </Text>
          <Text className="text-sm text-gray-600">Đang hoạt động</Text>
        </View>
      </View>

      {/* Messages */}
      <ScrollView className="flex-1 px-6 py-4">
        {messages.map((message) => (
          <View
            key={message.id}
            className={`mb-4 ${message.isMe ? 'items-end' : 'items-start'}`}
          >
            <View
              className={`max-w-[80%] rounded-lg px-4 py-3 ${
                message.isMe
                  ? 'bg-blue-500'
                  : 'bg-gray-200'
              }`}
            >
              <Text
                className={`text-base ${
                  message.isMe ? 'text-white' : 'text-gray-900'
                }`}
              >
                {message.body}
              </Text>
              <Text
                className={`text-xs mt-1 ${
                  message.isMe ? 'text-blue-100' : 'text-gray-500'
                }`}
              >
                {format(message.sentAt, 'HH:mm')}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <View className="bg-white border-t border-gray-200 px-6 py-4 flex-row items-center">
        <TextInput
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 mr-3"
          placeholder="Nhập tin nhắn..."
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity
          className="bg-blue-500 rounded-lg px-6 py-3"
          onPress={handleSend}
        >
          <Text className="text-white font-semibold">Gửi</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}


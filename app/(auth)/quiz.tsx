import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { layout } from '../../constants/layout';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'Khi phát hiện bệnh nhân có dấu hiệu bất thường, bạn nên làm gì?',
    options: [
      'Báo ngay cho gia đình và gọi cấp cứu nếu cần',
      'Tự xử lý mà không báo cho ai',
      'Chờ đến khi ca làm việc kết thúc mới báo',
      'Bỏ qua vì không phải trách nhiệm của mình',
    ],
    correctAnswer: 0,
  },
  {
    id: 2,
    question: 'Khi chăm sóc trẻ sơ sinh, điều quan trọng nhất là gì?',
    options: [
      'Vệ sinh sạch sẽ và đảm bảo an toàn',
      'Cho trẻ ăn càng nhiều càng tốt',
      'Để trẻ tự do vận động',
      'Không cần theo dõi thường xuyên',
    ],
    correctAnswer: 0,
  },
  {
    id: 3,
    question: 'Bạn có được phép tiết lộ thông tin bệnh nhân cho người khác không?',
    options: [
      'Có, nếu họ là người thân',
      'Không, phải bảo mật thông tin',
      'Có, nếu được trả tiền',
      'Tùy trường hợp',
    ],
    correctAnswer: 1,
  },
  {
    id: 4,
    question: 'Khi chăm sóc người già, bạn cần chú ý điều gì?',
    options: [
      'Chỉ cần cho ăn uống đủ',
      'Theo dõi sức khỏe, thuốc men và phòng ngừa té ngã',
      'Để họ tự chăm sóc',
      'Không cần quan tâm nhiều',
    ],
    correctAnswer: 1,
  },
  {
    id: 5,
    question: 'Trong trường hợp khẩn cấp, bạn nên làm gì đầu tiên?',
    options: [
      'Gọi cấp cứu 115',
      'Tìm kiếm trên mạng cách xử lý',
      'Chờ gia đình về',
      'Tự xử lý mà không cần hỗ trợ',
    ],
    correctAnswer: 0,
  },
];

export default function QuizScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 500);
    } else {
      // Quiz completed
      handleSubmit(newAnswers);
    }
  };

  const handleSubmit = async (answers: number[]) => {
    setLoading(true);
    
    // Calculate score
    const score = answers.reduce((acc, answer, index) => {
      return acc + (answer === QUIZ_QUESTIONS[index].correctAnswer ? 1 : 0);
    }, 0);

    const passed = score >= 4; // Need at least 4/5 correct

    setTimeout(() => {
      setLoading(false);
      if (passed) {
        Alert.alert(
          'Chúc mừng!',
          `Bạn đã hoàn thành bài quiz với ${score}/5 điểm đúng. Bạn có thể bắt đầu nhận ca!`,
          [
            {
              text: 'Bắt đầu',
              onPress: () => router.replace('/(tabs)'),
            },
          ]
        );
      } else {
        Alert.alert(
          'Chưa đạt yêu cầu',
          `Bạn đạt ${score}/5 điểm. Vui lòng làm lại bài quiz.`,
          [
            {
              text: 'Làm lại',
              onPress: () => {
                setCurrentQuestion(0);
                setSelectedAnswers([]);
              },
            },
          ]
        );
      }
    }, 1000);
  };

  const question = QUIZ_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <View style={{ flex: 1, paddingHorizontal: layout.horizontalPadding, paddingTop: 24, paddingBottom: 32 }}>
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Bài quiz an toàn
        </Text>
        <Text className="text-base text-gray-600 mb-6">
          Câu {currentQuestion + 1}/{QUIZ_QUESTIONS.length}
        </Text>

        {/* Progress bar */}
        <View className="h-2 bg-gray-200 rounded-full mb-8">
          <View
            className="h-2 bg-blue-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </View>

        {/* Question */}
        <View className="flex-1">
          <Text className="text-xl font-semibold text-gray-900 mb-8">
            {question.question}
          </Text>

          {/* Options */}
          <View className="gap-4">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion] === index;
              return (
                <TouchableOpacity
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-white'
                  }`}
                  onPress={() => handleAnswer(index)}
                >
                  <Text
                    className={`text-base ${
                      isSelected ? 'text-blue-700 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}


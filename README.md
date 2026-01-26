# O2O CarePro App

Mobile application cho Người chăm nom (CarePro) - Xây dựng với Expo và React Native.

## Công nghệ

- **Framework**: Expo (React Native)
- **Routing**: Expo Router (file-based routing)
- **State Management**: Zustand + React Query
- **Styling**: NativeWind (Tailwind CSS)
- **Language**: TypeScript

## Cấu trúc thư mục

Xem chi tiết trong `docs/PROJECT_STRUCTURE.md`

## Setup

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npx expo start

# Chạy trên Android
npx expo start --android

# Chạy trên iOS
npx expo start --ios
```

## Environment Variables

Tạo file `.env` từ `.env.example`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_WS_URL=ws://localhost:3000
EXPO_PUBLIC_MAP_API_KEY=your_google_maps_key
```

## Tính năng chính

- ✅ Đăng nhập/Đăng ký với OTP
- ✅ Hoàn thiện hồ sơ và eKYC
- ✅ Xem danh sách job phù hợp
- ✅ Nhận ca và đề nghị giá
- ✅ Chấm công (Check-in/out với GPS)
- ✅ Quản lý thu nhập và rút tiền
- ✅ Chat với khách hàng
- ✅ Đánh giá khách hàng

## Development

Xem `docs/IMPLEMENTATION_PLAN.md` để biết chi tiết kế hoạch phát triển.


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

**Lưu ý Windows:** Trên Node 22 có lỗi đã biết khi load Metro config (NativeWind). Dùng **Node 20 LTS** để chạy: tải tại [nodejs.org](https://nodejs.org) hoặc dùng `nvm use 20`.

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npx expo start

# Chạy với tunnel (tránh "request timed out" khi quét QR trên điện thoại)
npx expo start --tunnel

# Chạy trên Android
npx expo start --android

# Chạy trên iOS
npx expo start --ios

# Xem bản web: chạy expo start, sau đó mở trình duyệt:
# http://localhost:8081/?platform=web
# (hoặc nhấn w trong terminal khi đang chạy expo start)
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


# 회사 결제 전용 사이트

토스페이먼츠를 사용한 회사 전용 결제 시스템입니다.

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Payment**: 토스페이먼츠 SDK v2
- **UI Components**: Headless UI, Lucide React

## 주요 기능

- ✅ 토스페이먼츠 SDK v2 연동
- ✅ 카드 결제 및 무통장입금 지원
- ✅ 결제 성공/실패 페이지
- ✅ 반응형 디자인
- ✅ TypeScript 타입 안전성

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Toss Payments API Keys
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq
TOSS_SECRET_KEY=test_sk_D4yKeq5bgrpKRd0JYbLVGX0lzW6Y

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트
│   │   └── payments/      # 결제 관련 API
│   ├── payment/           # 결제 결과 페이지
│   │   ├── success/       # 결제 성공 페이지
│   │   └── fail/          # 결제 실패 페이지
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 메인 페이지
├── components/            # React 컴포넌트
│   └── PaymentButton.tsx  # 결제 버튼 컴포넌트
├── lib/                   # 유틸리티 함수
│   ├── utils.ts           # 공통 유틸리티
│   └── toss.ts            # 토스페이먼츠 서비스
└── types/                 # TypeScript 타입 정의
    ├── payment.ts         # 결제 관련 타입
    └── toss.ts            # 토스페이먼츠 타입
```

## API 엔드포인트

### 결제 요청

- **POST** `/api/payments/request`
- 토스페이먼츠 결제 요청을 처리합니다.

### 결제 확인

- **POST** `/api/payments/confirm`
- 결제 완료 후 결제를 확인합니다.

### 결제 상태 조회

- **GET** `/api/payments/status/[paymentKey]`
- 특정 결제의 상태를 조회합니다.

## 배포

### Vercel 배포

1. GitHub에 코드를 푸시합니다.
2. Vercel에서 프로젝트를 연결합니다.
3. 환경 변수를 설정합니다:
   - `NEXT_PUBLIC_TOSS_CLIENT_KEY`
   - `TOSS_SECRET_KEY`
   - `NEXT_PUBLIC_APP_URL`

### 환경 변수 설정

프로덕션 환경에서는 실제 토스페이먼츠 API 키를 사용해야 합니다:

```env
# Production Keys (실제 키로 교체)
NEXT_PUBLIC_TOSS_CLIENT_KEY=live_ck_...
TOSS_SECRET_KEY=live_sk_...
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 개발 가이드

### 새로운 결제 수단 추가

1. `src/types/toss.ts`에 타입 정의 추가
2. `src/components/PaymentButton.tsx`에서 결제 수단 로직 추가
3. API 라우트에서 해당 결제 수단 처리 로직 추가

### 스타일링 수정

Tailwind CSS를 사용하여 스타일을 수정할 수 있습니다. 컴포넌트별로 클래스명을 확인하고 수정하세요.

## 문제 해결

### 일반적인 문제

1. **토스페이먼츠 SDK 초기화 실패**

   - `NEXT_PUBLIC_TOSS_CLIENT_KEY`가 올바르게 설정되었는지 확인
   - 네트워크 연결 상태 확인

2. **결제 요청 실패**

   - `TOSS_SECRET_KEY`가 올바르게 설정되었는지 확인
   - API 요청 데이터 형식 확인

3. **TypeScript 오류**
   - 타입 정의가 올바른지 확인
   - 필요한 타입을 import했는지 확인

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 지원

문제가 발생하거나 질문이 있으시면 이슈를 생성해주세요.

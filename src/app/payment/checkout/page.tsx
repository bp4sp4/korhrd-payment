"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./checkout.module.css";

// TossPayments 타입 정의
interface TossPayments {
  requestPayment: (
    method: string,
    options: {
      amount: number;
      orderId: string;
      orderName: string;
      customerName: string;
      customerEmail: string;
      successUrl: string;
      failUrl: string;
    }
  ) => Promise<void>;
}

// Window 인터페이스 확장
declare global {
  interface Window {
    TossPayments?: TossPayments;
  }
}

// 로딩 컴포넌트
function CheckoutLoading() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/payment" className={styles.backButton}>
          ←
        </Link>
        <h1 className={styles.headerTitle}>수강바구니</h1>
        <div className={styles.headerSpacer}></div>
      </header>
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>로딩 중...</p>
      </div>
    </div>
  );
}

// 메인 체크아웃 컴포넌트
function CheckoutContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("quick");
  const [agreed, setAgreed] = useState(false);

  const courseData = {
    student: {
      title: "한평생교육 프리미엄 패키지 (우리 학생)",
      instructor: "한평생교육",
      originalPrice: 20000,
      discountRate: 50,
      finalPrice: 10000,
      discountAmount: 10000,
      type: "우리 학생",
    },
    external: {
      title: "한평생교육 프리미엄 패키지 (외부 학생)",
      instructor: "한평생교육",
      originalPrice: 150000,
      discountRate: 0,
      finalPrice: 150000,
      discountAmount: 0,
      type: "외부 학생",
    },
  };

  const currentData =
    courseData[type as keyof typeof courseData] || courseData.external;

  const paymentMethods = [
    { id: "quick", name: "퀵계좌이체", icon: "🏦" },
    { id: "card", name: "신용·체크카드", icon: "💳" },
    { id: "kakao", name: "카카오페이", icon: "🟡" },
    { id: "toss", name: "토스페이", icon: "🔵" },
    { id: "virtual", name: "가상계좌", icon: "🏛️" },
    { id: "corporate", name: "법인카드", icon: "🏢" },
    { id: "apple", name: "애플페이", icon: "🍎" },
  ];

  const handleTossPayment = () => {
    if (!agreed) {
      alert("약관에 동의해주세요.");
      return;
    }

    // 토스 결제 SDK 호출
    if (typeof window !== "undefined" && window.TossPayments) {
      window.TossPayments.requestPayment("카드", {
        amount: currentData.finalPrice,
        orderId: `order_${Date.now()}`,
        orderName: currentData.title,
        customerName: "홍길동",
        customerEmail: "hong@example.com",
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } else {
      // 토스 SDK가 로드되지 않은 경우
      alert("토스 결제를 준비 중입니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <header className={styles.header}>
        <Link href="/payment" className={styles.backButton}>
          ←
        </Link>
        <h1 className={styles.headerTitle}>수강바구니</h1>
        <div className={styles.headerSpacer}></div>
      </header>

      {/* 상품 정보 */}
      <div className={styles.productSection}>
        <div className={styles.productItem}>
          <div className={styles.productImage}>
            <img src="/images/course_thumbnail.png" alt="교육 과정" />
          </div>
          <div className={styles.productInfo}>
            <h3 className={styles.productTitle}>{currentData.title}</h3>
            <p className={styles.productInstructor}>{currentData.instructor}</p>
            <div className={styles.productType}>
              <span className={styles.typeBadge}>{currentData.type}</span>
            </div>
            <div className={styles.productPrice}>
              {currentData.discountRate > 0 && (
                <span className={styles.discountRate}>
                  {currentData.discountRate}%
                </span>
              )}
              <span className={styles.originalPrice}>
                ₩{currentData.originalPrice.toLocaleString()}
              </span>
              <span className={styles.finalPrice}>
                ₩{currentData.finalPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 구매자 정보 */}
      <div className={styles.buyerSection}>
        <div className={styles.sectionHeader}>
          <h3>구매자정보</h3>
          <button className={styles.editButton}>수정</button>
        </div>
        <div className={styles.buyerInfo}>
          <p>홍길동 (hong@example.com)</p>
        </div>
      </div>

      {/* 쿠폰 */}
      <div className={styles.couponSection}>
        <div className={styles.sectionHeader}>
          <h3>쿠폰</h3>
        </div>
        <div className={styles.couponInput}>
          <input type="text" placeholder="₩0" readOnly />
          <span className={styles.couponAvailable}>사용가능 0</span>
        </div>
        <button className={styles.couponButton}>쿠폰선택</button>
      </div>

      {/* 포인트 */}
      <div className={styles.pointsSection}>
        <div className={styles.sectionHeader}>
          <h3>포인트</h3>
        </div>
        <div className={styles.pointsInput}>
          <input type="text" placeholder="1,000원 이상 사용" readOnly />
          <span className={styles.pointsAvailable}>보유 0</span>
        </div>
        <button className={styles.pointsButton}>전액사용</button>
      </div>

      {/* 결제 방법 */}
      <div className={styles.paymentMethodSection}>
        <div className={styles.sectionHeader}>
          <h3>결제 방법</h3>
        </div>
        <div className={styles.paymentOptions}>
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              className={`${styles.paymentOption} ${
                selectedPaymentMethod === method.id ? styles.selected : ""
              }`}
              onClick={() => setSelectedPaymentMethod(method.id)}
            >
              <span className={styles.paymentIcon}>{method.icon}</span>
              <span className={styles.paymentName}>{method.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 결제 금액 요약 */}
      <div className={styles.summarySection}>
        <div className={styles.summaryItem}>
          <span>선택상품금액</span>
          <span>₩{currentData.originalPrice.toLocaleString()}</span>
        </div>
        <div className={styles.summaryItem}>
          <span>할인 금액</span>
          <span>-₩{currentData.discountAmount.toLocaleString()}</span>
        </div>
        <div className={styles.summaryTotal}>
          <span>총 결제 금액</span>
          <span>₩{currentData.finalPrice.toLocaleString()}</span>
        </div>
      </div>

      {/* 약관 동의 */}
      <div className={styles.agreementSection}>
        <label className={styles.agreementLabel}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className={styles.agreementCheckbox}
          />
          <span className={styles.agreementText}>
            회원 본인은 주문내용을 확인했으며, 구매조건및 개인정보처리방침과
            결제에 동의합니다.
          </span>
        </label>
      </div>

      {/* 하단 고정 결제 버튼 */}
      <div className={styles.stickyPaymentBar}>
        <div className={styles.paymentInfo}>
          <span>총 결제 금액</span>
          <div className={styles.paymentAmount}>
            <span className={styles.originalAmount}>
              ₩{currentData.originalPrice.toLocaleString()}
            </span>
            <span className={styles.finalAmount}>
              ₩{currentData.finalPrice.toLocaleString()}
            </span>
          </div>
        </div>
        <div className={styles.paymentButtons}>
          <button
            className={styles.tossButton}
            onClick={handleTossPayment}
            disabled={!agreed}
          >
            <span className={styles.tossText}>토스로 결제하기</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// 메인 페이지 컴포넌트
export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent />
    </Suspense>
  );
}

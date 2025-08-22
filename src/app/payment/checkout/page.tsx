"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./checkout.module.css";

// 로딩 컴포넌트
function CheckoutLoading() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button
          onClick={() => (window.location.href = "/")}
          className={styles.backButton}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          ←
        </button>
        <h1 className={styles.headerTitle}>결제진행</h1>
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
  const [isPaymentReady, setIsPaymentReady] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [domReady, setDomReady] = useState(false);

  const courseData = {
    student: {
      title: "실습섭외책임비 (우리 학생)",
      instructor: "한평생교육",
      price: 10000,
      type: "우리 학생",
    },
    external: {
      title: "실습섭외책임비 (외부 학생)",
      instructor: "한평생교육",
      price: 150000,
      type: "외부 학생",
    },
    certificate: {
      title: "취업자격증 발급비",
      instructor: "한평생교육",
      price: 30000,
      type: "자격증 발급",
    },
  };

  // URL 파라미터에서 amount 가져오기
  const amountParam = searchParams.get("amount");

  let currentData: {
    title: string;
    instructor: string;
    price: number;
    type: string;
  };

  if (type === "certificate" && amountParam) {
    // 자격증 발급비인 경우 동적 금액 설정
    const amount = parseInt(amountParam);
    currentData = {
      title: `취업자격증 발급비 (${(amount / 10000).toLocaleString()}만원)`,
      instructor: "한평생교육",
      price: amount,
      type: "자격증 발급",
    };
  } else {
    // 기존 로직
    currentData =
      courseData[type as keyof typeof courseData] || courseData.external;
  }

  // DOM 준비 완료
  useEffect(() => {
    setDomReady(true);
  }, []);

  // DOM이 준비되면 토스페이먼츠 위젯 초기화
  useEffect(() => {
    if (!domReady) return;

    async function initializeTossPayments() {
      try {
        console.log("토스페이먼츠 초기화 시작...");

        const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
        if (!clientKey) {
          throw new Error("클라이언트 키가 설정되지 않았습니다.");
        }

        // SDK 로드
        const { loadTossPayments, ANONYMOUS } = await import(
          "@tosspayments/tosspayments-sdk"
        );

        const tossPayments = await loadTossPayments(clientKey);
        const widgets = tossPayments.widgets({
          customerKey: ANONYMOUS,
        });

        // 결제 금액 설정
        await widgets.setAmount({
          currency: "KRW",
          value: currentData.price,
        });

        console.log("결제 금액 설정 완료:", currentData.price);

        // 위젯 렌더링
        await widgets.renderPaymentMethods({
          selector: "#payment-method",
          variantKey: "DEFAULT",
        });

        await widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        });

        console.log("토스페이먼츠 위젯 렌더링 완료");
        setIsPaymentReady(true);
        setPaymentError(null);

        // 결제 요청 함수를 전역으로 저장
        (window as unknown as Record<string, unknown>).requestTossPayment =
          async () => {
            try {
              const paymentData = {
                orderId: `order_${Date.now()}_${Math.random()
                  .toString(36)
                  .substr(2, 9)}`,
                orderName: currentData.title,
                successUrl: `${window.location.origin}/payment/success`,
                failUrl: `${window.location.origin}/payment/fail`,
              };

              console.log("결제 요청 데이터:", paymentData);
              await widgets.requestPayment(paymentData);
            } catch (error) {
              console.error("결제 요청 실패:", error);
            }
          };
      } catch (error) {
        console.error("토스페이먼츠 초기화 실패:", error);
        setPaymentError(`토스페이먼츠 초기화에 실패했습니다: ${error}`);
      }
    }

    initializeTossPayments();
  }, [domReady, currentData.price, currentData.title]);

  // 결제 요청
  const handlePayment = async () => {
    if (!isPaymentReady) {
      console.log("결제 시스템을 준비 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    const requestPayment = (window as unknown as Record<string, unknown>)
      .requestTossPayment as (() => Promise<void>) | undefined;
    if (requestPayment) {
      await requestPayment();
    } else {
      console.log("결제 시스템이 준비되지 않았습니다.");
    }
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <header className={styles.header}>
        <button
          onClick={() => {
            // certificate 타입인 경우 금액 선택 페이지로, 그 외에는 실습결제 페이지로
            if (type === "certificate") {
              window.location.href = "/payment/certificate";
            } else {
              window.location.href = "/payment";
            }
          }}
          className={styles.backButton}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          ←
        </button>
        <h1 className={styles.headerTitle}>결제진행</h1>
        <div className={styles.headerSpacer}></div>
      </header>

      {/* 상품 정보 */}
      <div className={styles.productSection}>
        <div className={styles.productItem}>
          <div className={styles.productImage}>
            <div className={styles.imagePlaceholder}>
              <span>📚</span>
            </div>
          </div>
          <div className={styles.productInfo}>
            <h3 className={styles.productTitle}>{currentData.title}</h3>
            <p className={styles.productInstructor}>{currentData.instructor}</p>
            <div className={styles.productType}>
              <span className={styles.typeBadge}>{currentData.type}</span>
            </div>
            <div className={styles.productPrice}>
              <span className={styles.finalPrice}>
                ₩{currentData.price.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 결제 방법 선택 */}
      <div className={styles.paymentMethodSection}>
        <h3>결제 방법</h3>
        <div id="payment-method" className={styles.paymentWidget}>
          {paymentError ? (
            <div className={styles.errorMessage}>
              <p>{paymentError}</p>
              <button
                className={styles.retryButton}
                onClick={() => window.location.reload()}
              >
                다시 시도
              </button>
            </div>
          ) : !isPaymentReady ? (
            <div className={styles.skeletonUI}>
              <div className={styles.skeletonCard}>
                <div className={styles.skeletonHeader}></div>
                <div className={styles.skeletonContent}>
                  <div className={styles.skeletonItem}></div>
                  <div className={styles.skeletonItem}></div>
                  <div className={styles.skeletonItem}></div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* 이용약관 */}
      <div className={styles.agreementSection}>
        <div id="agreement" className={styles.agreementWidget}>
          {paymentError ? (
            <div className={styles.errorMessage}>
              <p>{paymentError}</p>
              <button
                className={styles.retryButton}
                onClick={() => window.location.reload()}
              >
                다시 시도
              </button>
            </div>
          ) : !isPaymentReady ? (
            <div className={styles.skeletonUI}>
              <div className={styles.skeletonCard}>
                <div className={styles.skeletonHeader}></div>
                <div className={styles.skeletonContent}>
                  <div className={styles.skeletonItem}></div>
                  <div className={styles.skeletonItem}></div>
                  <div className={styles.skeletonItem}></div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* 결제 버튼 */}
      {isPaymentReady && !paymentError && (
        <div className={styles.paymentButtonSection}>
          <button className={styles.paymentButton} onClick={handlePayment}>
            결제하기
          </button>
        </div>
      )}
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

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
  const [isPaymentReady, setIsPaymentReady] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>("초기화");
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

  const currentData =
    courseData[type as keyof typeof courseData] || courseData.external;

  // DOM 요소가 렌더링되었는지 확인
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let checkCount = 0;
    const maxChecks = 50; // 최대 5초 대기

    const checkDOM = () => {
      checkCount++;
      const paymentMethod = document.querySelector("#payment-method");
      const agreement = document.querySelector("#agreement");

      console.log(`DOM 확인 시도 ${checkCount}:`, {
        paymentMethod: !!paymentMethod,
        agreement: !!agreement,
      });

      if (paymentMethod && agreement) {
        console.log("DOM 요소들이 준비되었습니다");
        setDomReady(true);
      } else if (checkCount >= maxChecks) {
        console.error("DOM 요소 확인 타임아웃");
        setPaymentError(
          "페이지 로딩에 시간이 오래 걸립니다. 새로고침해주세요."
        );
      } else {
        timeoutId = setTimeout(checkDOM, 100);
      }
    };

    // 약간의 지연 후 DOM 확인 시작
    timeoutId = setTimeout(checkDOM, 200);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  // DOM이 준비되면 토스페이먼츠 위젯 초기화
  useEffect(() => {
    if (!domReady) return;

    async function initializeTossPayments() {
      try {
        setLoadingStep("SDK 로드 중...");
        console.log("토스페이먼츠 초기화 시작...");

        const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
        if (!clientKey) {
          throw new Error("클라이언트 키가 설정되지 않았습니다.");
        }

        console.log(
          "클라이언트 키 확인됨:",
          clientKey.substring(0, 10) + "..."
        );

        // SDK 로드
        setLoadingStep("SDK 다운로드 중...");
        const { loadTossPayments, ANONYMOUS } = await import(
          "@tosspayments/tosspayments-sdk"
        );

        setLoadingStep("토스페이먼츠 초기화 중...");
        const tossPayments = await loadTossPayments(clientKey);

        setLoadingStep("위젯 생성 중...");
        const widgets = tossPayments.widgets({
          customerKey: ANONYMOUS,
        });

        // 결제 금액 설정
        setLoadingStep("결제 금액 설정 중...");
        await widgets.setAmount({
          currency: "KRW",
          value: currentData.price,
        });

        console.log("결제 금액 설정 완료:", currentData.price);

        // 위젯 렌더링
        setLoadingStep("위젯 렌더링 중...");
        await Promise.all([
          widgets.renderPaymentMethods({
            selector: "#payment-method",
            variantKey: "DEFAULT",
          }),
          widgets.renderAgreement({
            selector: "#agreement",
            variantKey: "AGREEMENT",
          }),
        ]);

        console.log("토스페이먼츠 위젯 렌더링 완료");
        setLoadingStep("완료");
        setIsPaymentReady(true);
        setPaymentError(null);

        // 결제 요청 함수를 전역으로 저장
        (window as any).requestTossPayment = async () => {
          try {
            // 고객 정보를 명시적으로 제외하고 필수 파라미터만 전달
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
            alert("결제 요청에 실패했습니다. 다시 시도해주세요.");
          }
        };
      } catch (error) {
        console.error("토스페이먼츠 초기화 실패:", error);
        setPaymentError(`토스페이먼츠 초기화에 실패했습니다: ${error}`);
      }
    }

    initializeTossPayments();
  }, [domReady, currentData.price]);

  // 결제 요청
  const handlePayment = async () => {
    if (!isPaymentReady) {
      alert("결제 시스템을 준비 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    if ((window as any).requestTossPayment) {
      await (window as any).requestTossPayment();
    } else {
      alert("결제 시스템이 준비되지 않았습니다.");
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
        <h3>이용약관</h3>
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

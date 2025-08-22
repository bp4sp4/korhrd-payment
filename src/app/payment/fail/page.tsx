"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./fail.module.css";

export default function PaymentFailPage() {
  const searchParams = useSearchParams();
  const [errorInfo, setErrorInfo] = useState<{
    code: string | null;
    message: string | null;
    orderId: string | null;
  } | null>(null);

  useEffect(() => {
    // URL 파라미터에서 에러 정보 추출
    const code = searchParams.get("code");
    const message = searchParams.get("message");
    const orderId = searchParams.get("orderId");

    if (code || message || orderId) {
      setErrorInfo({
        code,
        message,
        orderId,
      });
    }
  }, [searchParams]);

  return (
    <div className={styles.container}>
      <div className={styles.failCard}>
        <div className={styles.failIcon}>❌</div>
        <h1 className={styles.failTitle}>결제에 실패했습니다</h1>
        <p className={styles.failMessage}>결제 처리 중 문제가 발생했습니다.</p>

        {errorInfo && (
          <div className={styles.errorDetails}>
            {errorInfo.code && (
              <div className={styles.detailItem}>
                <span>에러 코드:</span>
                <span>{errorInfo.code}</span>
              </div>
            )}
            {errorInfo.message && (
              <div className={styles.detailItem}>
                <span>에러 메시지:</span>
                <span>{errorInfo.message}</span>
              </div>
            )}
            {errorInfo.orderId && (
              <div className={styles.detailItem}>
                <span>주문번호:</span>
                <span>{errorInfo.orderId}</span>
              </div>
            )}
          </div>
        )}

        <div className={styles.buttonGroup}>
          <Link href="/payment/checkout" className={styles.retryButton}>
            다시 시도하기
          </Link>
          <Link href="/" className={styles.homeButton}>
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

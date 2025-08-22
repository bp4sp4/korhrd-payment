"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./success.module.css";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState<{
    paymentKey: string;
    orderId: string;
    amount: number;
  } | null>(null);

  useEffect(() => {
    // URL 파라미터에서 결제 정보 추출
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    if (paymentKey && orderId && amount) {
      setPaymentInfo({
        paymentKey,
        orderId,
        amount: parseInt(amount),
      });
    }
  }, [searchParams]);

  return (
    <div className={styles.container}>
      <div className={styles.successCard}>
        <div className={styles.successIcon}>✅</div>
        <h1 className={styles.successTitle}>결제가 완료되었습니다!</h1>
        <p className={styles.successMessage}>안전하게 결제가 처리되었습니다.</p>

        {paymentInfo && (
          <div className={styles.paymentDetails}>
            <div className={styles.detailItem}>
              <span>주문번호:</span>
              <span>{paymentInfo.orderId}</span>
            </div>
            <div className={styles.detailItem}>
              <span>결제금액:</span>
              <span>₩{paymentInfo.amount.toLocaleString()}</span>
            </div>
          </div>
        )}

        <div className={styles.buttonGroup}>
          <Link href="/" className={styles.homeButton}>
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, Suspense } from "react";
import styles from "./certificate.module.css";

// 로딩 컴포넌트
function CertificateLoading() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button
          onClick={() => {
            try {
              window.location.replace("/");
            } catch (error) {
              console.error("홈으로 이동 중 오류 발생:", error);
              // fallback으로 href 사용
              window.location.href = "/pament/certificate";
            }
          }}
          className={styles.backButton}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          ←
        </button>
        <h1 className={styles.headerTitle}>취업자격증 발급비</h1>
        <div className={styles.headerSpacer}></div>
      </header>
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>로딩 중...</p>
      </div>
    </div>
  );
}

// 메인 컴포넌트
function CertificateContent() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const certificateOptions = [
    { amount: 100000, label: "10만원", count: 1 },
    { amount: 200000, label: "20만원", count: 2 },
    { amount: 300000, label: "30만원", count: 3 },
    { amount: 400000, label: "40만원", count: 4 },
    { amount: 500000, label: "50만원", count: 5 },
    { amount: 600000, label: "60만원", count: 6 },
    { amount: 700000, label: "70만원", count: 7 },
    { amount: 800000, label: "80만원", count: 8 },
    { amount: 900000, label: "90만원", count: 9 },
    { amount: 1000000, label: "100만원", count: 10 },
  ];

  const handleSelection = (amount: number) => {
    setSelectedAmount(amount);
  };

  const handleContinue = () => {
    if (selectedAmount) {
      try {
        // 선택된 금액을 URL 파라미터로 전달
        // replace를 사용하여 현재 페이지를 히스토리에서 제거
        window.location.replace(
          `/payment/checkout?type=certificate&amount=${selectedAmount}`
        );
      } catch (error) {
        console.error("페이지 이동 중 오류 발생:", error);
        alert("페이지 이동 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <header className={styles.header}>
        <button
          onClick={() => (window.location.href = "/")}
          className={styles.backButton}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          ←
        </button>
        <h1 className={styles.headerTitle}>취업자격증 발급비</h1>
        <div className={styles.headerSpacer}></div>
      </header>

      {/* 안내 메시지 */}
      <div className={styles.infoSection}>
        <h2 className={styles.infoTitle}>발급비 금액을 선택해주세요</h2>
        <p className={styles.infoDescription}>
          취업에 필요한 자격증 발급 비용을 선택하세요
        </p>
      </div>

      {/* 금액 선택 옵션 */}
      <div className={styles.optionsSection}>
        {certificateOptions.map((option) => (
          <div
            key={option.amount}
            className={`${styles.optionCard} ${
              selectedAmount === option.amount ? styles.selected : ""
            }`}
            onClick={() => handleSelection(option.amount)}
            onTouchStart={(e) => e.preventDefault()}
            onTouchEnd={(e) => e.preventDefault()}
          >
            <div className={styles.optionHeader}>
              <div className={styles.optionTitle}>
                <h3>
                  {option.label} ({option.count}개)
                </h3>
                <p className={styles.optionDescription}>취업자격증 발급비</p>
              </div>
              <div className={styles.optionPrice}>
                <span className={styles.priceAmount}>
                  ₩{option.amount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className={styles.optionBenefits}>
              <h4>포함 혜택</h4>
              <ul>
                <li>자격증 발급 서비스</li>
                <li>공식 인증서 제공</li>
                <li>온라인 조회 서비스</li>
              </ul>
            </div>

            <div className={styles.optionBadge}>
              {selectedAmount === option.amount && (
                <span className={styles.selectedBadge}>✓ 선택됨</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 하단 고정 버튼 */}
      <div className={styles.stickyButtonBar}>
        <button
          className={`${styles.continueButton} ${
            selectedAmount ? styles.active : styles.disabled
          }`}
          onClick={handleContinue}
          disabled={!selectedAmount}
        >
          {selectedAmount
            ? `${(selectedAmount / 10000).toLocaleString()}만원 (${
                selectedAmount / 100000
              }개)으로 결제하기`
            : "금액을 선택해주세요"}
        </button>
      </div>
    </div>
  );
}

// 메인 페이지 컴포넌트
export default function CertificatePage() {
  return (
    <Suspense fallback={<CertificateLoading />}>
      <CertificateContent />
    </Suspense>
  );
}

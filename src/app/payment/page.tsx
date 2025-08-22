"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./payment.module.css";

export default function PaymentPage() {
  const [selectedType, setSelectedType] = useState("");

  const courseOptions = [
    {
      id: "student",
      title: "우리 학생",
      price: 10000,
      description: "한평생교육 재학생/졸업생",
      benefits: ["우리 학생 전용 할인", "추가 혜택 제공", "전용 커뮤니티 접근"],
      color: "#28a745",
    },
    {
      id: "external",
      title: "외부 학생",
      price: 150000,
      description: "일반 수강생",
      benefits: ["기본 교육 과정", "표준 혜택", "일반 커뮤니티 접근"],
      color: "#007bff",
    },
  ];

  const handleSelection = (type: string) => {
    setSelectedType(type);
  };

  const handleContinue = () => {
    if (selectedType) {
      // 선택된 타입을 URL 파라미터로 전달
      window.location.href = `/payment/checkout?type=${selectedType}`;
    }
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <header className={styles.header}>
        <Link href="/" className={styles.backButton}>
          ←
        </Link>
        <h1 className={styles.headerTitle}>수강 신청</h1>
        <div className={styles.headerSpacer}></div>
      </header>

      {/* 안내 메시지 */}
      <div className={styles.infoSection}>
        <h2 className={styles.infoTitle}>수강 유형을 선택해주세요</h2>
        <p className={styles.infoDescription}>
          학생 유형에 따라 수강료와 혜택이 다릅니다
        </p>
      </div>

      {/* 선택 옵션 */}
      <div className={styles.optionsSection}>
        {courseOptions.map((option) => (
          <div
            key={option.id}
            className={`${styles.optionCard} ${
              selectedType === option.id ? styles.selected : ""
            }`}
            onClick={() => handleSelection(option.id)}
          >
            <div className={styles.optionHeader}>
              <div className={styles.optionTitle}>
                <h3>{option.title}</h3>
                <p className={styles.optionDescription}>{option.description}</p>
              </div>
              <div className={styles.optionPrice}>
                <span className={styles.priceAmount}>
                  ₩{option.price.toLocaleString()}
                </span>
                <span className={styles.priceUnit}>/월</span>
              </div>
            </div>

            <div className={styles.optionBenefits}>
              <h4>포함 혜택</h4>
              <ul>
                {option.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>

            <div className={styles.optionBadge}>
              {selectedType === option.id && (
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
            selectedType ? styles.active : styles.disabled
          }`}
          onClick={handleContinue}
          disabled={!selectedType}
        >
          {selectedType ? "다음 단계로" : "수강 유형을 선택해주세요"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import styles from "./swiper.module.css";

// Swiper CSS
import "swiper/css";

const swiperData = [
  {
    id: 1,
    title: "25년도 예상 영업 이익",
    value: "55억원+",
    backgroundColor:
      "linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%)",
  },
  {
    id: 2,
    title: "2023~2024년도 회사 성장률",
    value: "200%",
    backgroundColor:
      "linear-gradient(135deg, #dbeafe 0%, #93c5fd 50%, #3b82f6 100%)",
  },
  {
    id: 3,
    title: "업무 제휴사",
    value: "20곳+",
    backgroundColor:
      "linear-gradient(135deg, #f3e8ff 0%, #c4b5fd 50%, #8b5cf6 100%)",
  },
  {
    id: 4,
    title: "전문 에듀바이저",
    value: "20명+",
    backgroundColor:
      "linear-gradient(135deg, #ecfdf5 0%, #6ee7b7 50%, #10b981 100%)",
  },
  {
    id: 5,
    title: "한평생교육을 거쳐간 회원 수",
    value: "1.9만명+",
    backgroundColor:
      "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)",
  },
];

export default function SwiperSection() {
  return (
    <div className={styles.container}>
      <div className={styles.textSection}>
        <h2 className={styles.mainTitle}>
          한평생교육은 매일
          <br />
          새로운 역사를 쓰고 있어요
        </h2>
        <p className={styles.dateText}>2025년 예상 기준</p>
      </div>
      <div className={styles.swiperContainer}>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={1.5}
          centeredSlides={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
          className={styles.swiper}
        >
          {swiperData.map((item) => (
            <SwiperSlide key={item.id} className={styles.swiperSlide}>
              <div
                className={styles.card}
                style={{ background: item.backgroundColor }}
              >
                <div className={styles.cardHeader}>{item.title}</div>
                <div className={styles.cardValue}>{item.value}</div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

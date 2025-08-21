"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import styles from "./swiper.module.css";
import Image from "next/image";

// Swiper CSS
import "swiper/css";

const swiperData2 = [
  {
    id: 1,
    image: "/images/eduservice.png",
  },
  {
    id: 2,
    image: "/images/eduviors.png",
  },
  {
    id: 3,
    image: "/images/train.png",
  },
  {
    id: 4,
    image: "/images/eduservice.png",
  },
  {
    id: 5,
    image: "/images/eduviors.png",
  },
];

export default function SwiperSection2() {
  return (
    <div className={styles.container}>
      <div className={styles.textSection}>
        <h2 className={styles.mainTitle}>
          한평생 교육에서
          <br />
          올인원 학습 솔루션
        </h2>
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
          {swiperData2.map((item) => (
            <SwiperSlide key={item.id} className={styles.swiperSlide}>
              <div className={styles.card}>
                <div className={styles.cardImage}>
                  <Image
                    src={item.image}
                    alt="교육 이미지"
                    width={280}
                    height={280}
                    className={styles.image}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

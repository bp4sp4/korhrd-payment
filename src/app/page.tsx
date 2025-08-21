import styles from "./main.module.css";
import SwiperSection from "./components/SwiperSection";
import SwiperSection2 from "./components/SwiperSection2";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          교육으로 꿈꾸는 더 나은 내일
          <br />
          교육의 가치를 믿는 우리가 함께합니다
        </h1>
        <div className={styles.imageContainer}>
          {/* 여기에 이미지를 넣으세요 */}
          <img
            src="/images/main_img.png"
            alt="교육 결제 이미지"
            width={1200}
            height={648}
            className={styles.mainImage}
          />
        </div>
        <div className={styles.description}>
          한평생교육은 많은 이들이 자신과 맞지 않는 교육을
          <br />
          선택하거나 복잡해진 실무·취업 환경에 적응하지 못해 시작조차
          <br />
          어려워하는 경우가 많다는 사실을 확인했습니다.
        </div>
        <div className={styles.subTitleWrapper}>
          <h2 className={styles.subTitle}>한평생 교육이 일하는 방식</h2>
          <p className={styles.subTitleDescription}>
            어디에서 시작하냐 중요하다고 생각해요
          </p>
          <p className={styles.subTitleDescription2}>
            학습자 각자의 환경과 여건을 먼저 이해하 그에 걸맞은 최적의
            교육과정을
            <br /> 제공함으로써 진짜 필요한 교육을 실현합니다.
          </p>
        </div>

        <div className={styles.swiperSection}>
          <SwiperSection />
        </div>
        <div className={styles.swiperSection}>
          <SwiperSection2 />
        </div>

        {/* 결제 CTA 섹션 */}
        <div className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>지금 바로 시작하세요</h2>
            <p className={styles.ctaDescription}>
              한평생교육과 함께 당신의 꿈을 실현해보세요
              <br />
              안전하고 간편한 결제로 교육을 시작할 수 있습니다
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/payment" className={styles.ctaButtonPrimary}>
                교육 결제하기
              </Link>
              <Link href="/about" className={styles.ctaButtonSecondary}>
                더 알아보기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import styles from "./main.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* 메인 배너 */}
      <div className={styles.mainBanner}>
        <div className={styles.bannerImage}>
          <img
            src="/images/main_banner.png"
            alt="한평생교육 배너"
            className={styles.bannerImg}
          />
        </div>
      </div>

      {/* 인기 과정 */}
      <div className={styles.popularSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>결제 과정</h2>
        </div>
        <div className={styles.courseGrid}>
          <Link href="/payment?type=practice" className={styles.courseCard}>
            <div className={styles.courseImage}>
              <img src="/images/course1.png" alt="실습섭외책임비" />
            </div>
            <div className={styles.courseInfo}>
              <h3 className={styles.courseTitle}>실습섭외책임비</h3>
              <p className={styles.courseDesc}>
                실습 과정 중 발생하는 책임비용
              </p>
              <div className={styles.coursePrice}>
                <button className={styles.paymentButton}>결제하러가기</button>
              </div>
            </div>
          </Link>
          <Link
            href="/payment/checkout?type=certificate"
            className={styles.courseCard}
          >
            <div className={styles.courseImage}>
              <img src="/images/course2.png" alt="취업자격증 발급비" />
            </div>
            <div className={styles.courseInfo}>
              <h3 className={styles.courseTitle}>취업자격증 발급비</h3>
              <p className={styles.courseDesc}>
                취업에 필요한 자격증 발급 비용
              </p>
              <div className={styles.coursePrice}>
                <button className={styles.paymentButton}>결제하러가기</button>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

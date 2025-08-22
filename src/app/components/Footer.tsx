import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* 중간 섹션 */}
        <div className={styles.middleSection}>
          <h2 className={styles.companyName}>(주)한평생교육그룹</h2>
        </div>

        {/* 하단 섹션 */}
        <div className={styles.bottomSection}>
          <p className={styles.businessInfo}>
            사업자등록번호 : 227-88-03196 | 직업평생교육시설신고 (제 원격20-6호)
            | 대표: 양병웅
          </p>
          <p className={styles.address}>
            주소 : 서울시 도봉구 창동 마들로13길 61 씨드큐브 905호
          </p>
          <p className={styles.legalLinks}>서비스 이용약관 개인정보 처리방침</p>
          <p className={styles.copyright}>
            2025 © Korhrd payments. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

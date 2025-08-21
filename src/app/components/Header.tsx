"use client";

import styles from "./header.module.css";
import Image from "next/image";

export default function Header() {
  const navItems = [
    { name: "실습결제", link: "/about" },
    { name: "민간결제", link: "/culture" },
    { name: "에듀바이저스", link: "/services" },
    { name: "자주묻는질문", link: "/blog" },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.nav}>
          {/* 당근 로고 */}
          <div className={styles.logoContainer}>
            <div className={styles.logoWrapper}>
              {/* 당근 로고 SVG */}
              <div className={styles.logoIcon}>
                <Image
                  src="/images/logo2.png"
                  alt="logo"
                  width={25}
                  height={25}
                />
              </div>
              {/* "당근" 텍스트 */}
              <span className={styles.logoText}>한평생 결제사이트</span>
            </div>
          </div>

          {/* 네비게이션 - 모든 화면에서 보임 */}
          <nav className={styles.navigation}>
            {navItems.map((item) => (
              <a key={item.name} href={item.link} className={styles.navLink}>
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import styles from "./header.module.css";
import Link from "next/link";

export default function Header() {
  const pathname = usePathname();
  const [navItems, setNavItems] = useState<
    Array<{ name: string; link: string }>
  >([]);

  useEffect(() => {
    // 항상 두 메뉴 모두 표시
    setNavItems([
      { name: "실습결제", link: "/payment" },
      { name: "민간결제", link: "/payment/certificate" },
    ]);
  }, [pathname]);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* 로고 */}
        <div className={styles.logoSection}>
          <Link href="/" className={styles.logo}>
            <img
              src="/images/logo2.png"
              alt="한평생결제사이트"
              className={styles.logoImage}
            />
            <span className={styles.logoText}>한평생 페이먼츠</span>
          </Link>
        </div>

        {/* 가로 네비게이션 메뉴 */}
        {navItems.length > 0 && (
          <nav className={styles.navigation}>
            <div className={styles.navContainer}>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.link}
                  className={styles.navLink}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

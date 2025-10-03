"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./BottomNav.module.css";

export default function BottomNav() {
  const navItems = [
    {
      name: "ホーム",
      href: "/",
      icon: {
        default: "ph:house-duotone",
        fill: "ph:house-fill",
      },
    },
    {
      name: "日記",
      href: "/diary",
      icon: {
        default: "ph:notebook-duotone",
        fill: "ph:notebook-fill",
      },
    },
    {
      name: "友達",
      href: "/friends",
      icon: {
        default: "ph:address-book-duotone",
        fill: "ph:address-book-fill",
      },
    },
    {
      name: "設定",
      href: "/settings",
      icon: {
        default: "ph:gear-six-duotone",
        fill: "ph:gear-six-fill",
      },
    },
  ];

  const currentPath = usePathname();
  const basePath = `/${currentPath.split("/")[1]}`;

  return (
    <footer className={styles.bottom_nav}>
      <ul className={styles.list}>
        {navItems.map((item) => {
          const isActive = basePath === item.href;

          return (
            <li className={styles.item} key={item.name}>
              <Link className={styles.tap_area} href={item.href}>
                <Icon
                  className={styles.icon}
                  icon={isActive ? item.icon.fill : item.icon.default}
                  width="32"
                  height="32"
                />
                <span className={styles.label}>{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </footer>
  );
}

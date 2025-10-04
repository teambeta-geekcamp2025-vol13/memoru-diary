import { Icon } from "@iconify/react";
import Link from "next/link";
import styles from "./IconLink.module.css";

type PageProps = {
  iconName: string;
  href: string;
  size?: number;
};

export default function IconLink({ iconName, href, size = 24 }: PageProps) {
  return (
    <Link href={href} className={styles.icon_wrapper}>
      <Icon
        className={styles.icon}
        icon={iconName}
        width={size}
        height={size}
      />
    </Link>
  );
}

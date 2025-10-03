import { Icon } from "@iconify/react";
import Link from "next/link";
import styles from "./IconLink.module.css";

type PageProps = {
  iconName: string;
  isFilled?: boolean;
  href: string;
};

export default function IconLink({
  iconName,
  isFilled = false,
  href,
}: PageProps) {
  return (
    <Link href={href} className={styles.icon_wrapper}>
      <Icon
        className={styles.icon}
        icon={iconName}
        fontStyle={isFilled ? "filled" : "outlined"}
      />
    </Link>
  );
}

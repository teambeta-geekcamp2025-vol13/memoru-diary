import Image from "next/image";
import IconLink from "../button/IconLink";
import styles from "./Header.module.css";
import ProgressBar from "./ProgressBar";

export default function () {
  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <Image
          src="/logo.svg"
          alt="Memoru日記ロゴ"
          className={styles.logo}
          height={40}
          width={200}
        />
        <IconLink size={32} iconName="ph:bell-duotone" href="/notify" />
      </nav>
      <ProgressBar allTasks={5} completedTasks={3} />
    </header>
  );
}

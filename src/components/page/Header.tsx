import IconLink from "../button/IconLink";
import styles from "./Header.module.css";
import ProgressBar from "./ProgressBar";

export default function () {
  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <h1 className={styles.title}>Memoru日記</h1>
        <IconLink size={32} iconName="ph:bell-duotone" href="/notify" />
      </nav>
      <ProgressBar allTasks={5} completedTasks={3} />
    </header>
  );
}

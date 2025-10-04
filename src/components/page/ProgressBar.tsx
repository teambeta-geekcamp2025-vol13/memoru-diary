import styles from "./ProgressBar.module.css";

type PageProps = {
  allTasks: number;
  completedTasks: number;
};

export default function ProgressBar({ allTasks, completedTasks }: PageProps) {
  const value = allTasks === 0 ? 0 : (completedTasks / allTasks) * 100;

  return (
    <div className={styles.progress_bar}>
      <div className={styles.label}>
        <p>今日の進捗</p>
        <p>
          {completedTasks} / {allTasks}
        </p>
      </div>
      <progress max={100} value={value}></progress>
    </div>
  );
}

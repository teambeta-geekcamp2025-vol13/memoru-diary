import styles from "./Popup.module.css";

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  setClose: () => void;
};

export default function Popup({ children, isOpen, setClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.container}>
        <section className={styles.content}>{children}</section>
      </div>
      <button className={styles.close_button} type="button" onClick={setClose}>
        {/* TODO: アイコンを追加、スタイルの微修正 */}
        閉じる
      </button>
    </div>
  );
}

import styles from "./page.module.css";

export default function FriendsPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>友達ページ</h1>
      <div>
        <h2>フレンド検索</h2>
        <div>
          <input type="text" />
        </div>
      </div>
      <div>
        <h2>フレンドリスト</h2>
        <ul>
          <li>友達1</li>
          <li>友達2</li>
          <li>友達3</li>
        </ul>
      </div>
      <div>
        <h2>最新の投稿</h2>
      </div>
    </div>
  );
}

import styles from "../../../styles/landing.module.css";
import Image from 'next/image'
import github from "../../../public/github.png"
import sky from "../../../public/sky.png"
import sky2 from "../../../public/sky2.png"
import Link from "next/link";
export default function Landing() {
    return <div className={styles.cotainar}>


        <div className={styles.slide}>
          <Image src={sky} alt="apple1" width={250} height={250}/>
          <Image src={sky2} alt="apple2" width={250} height={250} />
        </div>

        <h1 className={styles.h1}>Memoru日記</h1>
        <div className={styles.p}><p >写真を撮ったり、ひとことをメモ</p><p>するだけで日記がまとまる！</p></div>
        <div>
				<button className={styles.login}><Link href="/login"/>Googleでログイン</button>
			</div>

        <p className={styles.p}><Link href="/login"/>新規登録はこちらから</p>
        <div className={styles.memo}><p>メモルリーは日記が続かない人の習慣化をサポートするアプリです！</p><p>通知が来たタイミングで写真を撮ったり、一言メモを記録するだけでその日の日記が完成します！</p></div>
        <h2 className={styles.h2}>こんな人に</h2>
        <ul className={styles.ul}>
            <li className={styles.li}><p className={styles.emoji}>😅</p>ついついサボっちゃう人</li>
            <li className={styles.li}><p className={styles.emoji}>😪</p>眠たくて図鑑が取れない</li>
            <li className={styles.li}><p className={styles.emoji}>🤔</p>考えすぎて時間がかかる</li>
            <li className={styles.li}><p className={styles.emoji}>🔰</p>これから日記の習慣を付けたい</li>
        </ul>
        <h2 className={styles.h2}>紹介スライド</h2>
        <div className={styles.bottom}>

            <p className={styles.links}><Image src={github} alt="github" width={30} height={30} /><a href="https://github.com/teambeta-geekcamp2025-vol13/memoru-diary">ソースコード</a></p>
            <p className={styles.links}><a href="">✉️お問い合わせフォーム</a></p>
            <p className={styles.p}>利用規約・免責事項</p>
            <p className={styles.p}>ver0.01</p>
        </div>
    </div>;



}

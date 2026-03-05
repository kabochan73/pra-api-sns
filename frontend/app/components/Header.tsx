import Link from 'next/link';
import styles from './Header.module.css';

type Props = {
  username: string;
  userId: number;
  onLogout: () => void;
};

export default function Header({ username, userId, onLogout }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <span className={styles.logo}>
          SNS
        </span>
        <div className={styles.right}>
          <Link href={`/profile/${userId}`}>
            <span className={styles.username}>{username} さん</span>
          </Link>
          <button className={styles.logoutButton} onClick={onLogout}>
            ログアウト
          </button>
        </div>
      </div>
    </header>
  );
}

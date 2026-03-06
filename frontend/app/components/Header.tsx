'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import styles from './Header.module.css';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

type Props = {
  username: string;
  userId: number;
  onLogout: () => void;
};

export default function Header({ username, userId, onLogout }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <span className={styles.logo}>SNS</span>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.searchWrapper}>
            <MagnifyingGlassIcon className={styles.searchIcon} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="検索..."
              className={styles.searchInput}
            />
          </div>
        </form>
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

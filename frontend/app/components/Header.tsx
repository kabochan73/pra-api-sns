'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import styles from './Header.module.css';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

type Props = {
  username: string;
  userId: number;
  onLogout: () => void;
  defaultQuery?: string;
};

export default function Header({ username, userId, onLogout, defaultQuery = '' }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);
  const userTyped = useRef(false);

  useEffect(() => {
    setQuery(defaultQuery);
  }, [defaultQuery]);

  useEffect(() => {
    if (!userTyped.current) return;
    const timer = setTimeout(() => {
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    userTyped.current = true;
    setQuery(e.target.value);
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <span className={styles.logo}>SNS</span>
        <form className={styles.searchForm} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.searchWrapper}>
            <MagnifyingGlassIcon className={styles.searchIcon} />
            <input
              type="text"
              value={query}
              onChange={handleChange}
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

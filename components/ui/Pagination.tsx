"use client";

import { useState } from "react";
import styles from "./UI.module.css";

export interface PaginationProps {
  totalPages: number;
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  disabled?: boolean;
  className?: string;
}

export default function Pagination({ totalPages, page, defaultPage = 1, onPageChange, disabled = false, className = "" }: PaginationProps) {
  const [internalPage, setInternalPage] = useState(defaultPage);
  const total = Number.isFinite(totalPages) ? Math.max(1, Math.floor(totalPages)) : 1;
  const requested = page ?? internalPage;
  const current = Number.isFinite(requested) ? Math.min(total, Math.max(1, Math.floor(requested))) : 1;
  const candidates = total <= 7
    ? Array.from({ length: total }, (_, index) => index + 1)
    : current <= 4 ? [1, 2, 3, 4, 5, total]
    : current >= total - 3 ? [1, total - 4, total - 3, total - 2, total - 1, total]
    : [1, current - 1, current, current + 1, total];
  const items: (number | string)[] = [];
  candidates.forEach((value, index) => {
    if (index > 0 && value - candidates[index - 1] > 1) items.push(`gap-${value}`);
    items.push(value);
  });

  function select(next: number) {
    if (disabled || next === current || next < 1 || next > total) return;
    if (page === undefined) setInternalPage(next);
    onPageChange?.(next);
  }

  return (
    <nav aria-label="Pagination" className={`${styles.pagination} ${className}`}>
      <button type="button" className={`${styles.pageButton} ${styles.pageArrow}`} aria-label="Halaman sebelumnya" disabled={disabled || current === 1} onClick={() => select(current - 1)}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m10 4-4 4 4 4" stroke="currentColor" strokeWidth="1.5" /></svg>
      </button>
      {items.map((item) => typeof item === "string"
        ? <span key={item} className={styles.ellipsis} aria-hidden="true">…</span>
        : <button key={item} type="button" className={styles.pageButton} aria-label={`Halaman ${item}`} aria-current={item === current ? "page" : undefined} disabled={disabled} onClick={() => select(item)}>{item}</button>)}
      <button type="button" className={`${styles.pageButton} ${styles.pageArrow}`} aria-label="Halaman berikutnya" disabled={disabled || current === total} onClick={() => select(current + 1)}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m6 4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" /></svg>
      </button>
    </nav>
  );
}
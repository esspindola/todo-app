import React from "react";
import styles from "../../styles/Pagination.module.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className={styles.pageItem}
        >
          1
        </button>
      );

      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className={styles.ellipsis}>
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`${styles.pageItem} ${
            i === currentPage ? styles.active : ""
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className={styles.ellipsis}>
            ...
          </span>
        );
      }

      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={styles.pageItem}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className={styles.pagination}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={styles.pageArrow}
      >
        &laquo;
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={styles.pageArrow}
      >
        &raquo;
      </button>
    </div>
  );
}

import React, { useState } from "react";
import styles from "../../styles/Card.module.scss";
import TaskModal from "./TaskModal";

interface CardProps {
  title: string;
  description: string;
  status: "completado" | "en curso";
  done: boolean;
  createdAt: string;
  onDelete: () => void;
  onComplete: () => void;
  onEdit: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  status,
  done,
  createdAt,
  onDelete,
  onComplete,
  onEdit,
}) => {
  const [showModal, setShowModal] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <>
      <div className={styles.Card}>
        <div className={styles.CardSideActions}>
          <button
            className={`${styles.ActionButton} view`}
            onClick={() => setShowModal(true)}
          >
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <circle cx="12" cy="12" r="3" strokeWidth="2" />
            </svg>
          </button>
          <button
            className={`${styles.ActionButton} complete`}
            onClick={onComplete}
            disabled={done}
          >
            <svg viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" strokeWidth="2" />
            </svg>
          </button>
          <button className={`${styles.ActionButton} edit`} onClick={onEdit}>
            <svg viewBox="0 0 24 24">
              <path d="M12 20h9" strokeWidth="2" />
              <path
                d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>
        <div className={styles.CardMainContent}>
          <div className={styles.CardHeader}>
            <h2 className={styles.CardTitle}>{truncateText(title, 25)}</h2>
            <span
              className={
                status === "completado"
                  ? styles.StatusDone
                  : styles.StatusInProgress
              }
            >
              {status === "completado" ? "✓" : "⋯"}
            </span>
          </div>
          <div className={styles.CardContent}>
            <p className={styles.CardDescription}>
              {truncateText(description, 100)}
            </p>
            <div className={styles.CardDate}>{formatDate(createdAt)}</div>
          </div>
        </div>
        <div className={styles.CardDeleteAction}>
          <button
            className={`${styles.ActionButton} delete`}
            onClick={onDelete}
          >
            <svg viewBox="0 0 24 24">
              <rect x="3" y="6" width="18" height="14" rx="2" strokeWidth="2" />
              <path d="M9 10v6M15 10v6" strokeWidth="2" />
              <path d="M10 6V4h4v2" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </div>

      <TaskModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={title}
        description={description}
        status={status}
        createdAt={createdAt}
      />
    </>
  );
};

export default Card;

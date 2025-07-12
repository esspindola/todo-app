import React from "react";
import styles from "../../styles/TaskModal.module.scss";
import Button from "./Button";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  status: "completado" | "en curso";
  createdAt: string;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  status,
  createdAt,
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.statusBadge}>
            <span
              className={
                status === "completado" ? styles.completed : styles.inProgress
              }
            >
              {status === "completado" ? "Completado" : "En curso"}
            </span>
          </div>

          <div className={styles.dateInfo}>
            Creado el {formatDate(createdAt)}
          </div>

          <div className={styles.descriptionContainer}>
            <h3 className={styles.sectionTitle}>Descripción</h3>
            <div className={styles.description}>{description}</div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;

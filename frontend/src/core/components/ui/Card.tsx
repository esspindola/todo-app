import React from "react";
import styles from "../../styles/Card.module.scss";
import Button from "./Button";

interface CardProps {
  title: string;
  description: string;
  status: "completado" | "en curso";
  createdAt: string;
  onDelete: () => void;
  onComplete: () => void;
  onEdit: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  status,
  createdAt,
  onDelete,
  onComplete,
  onEdit,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  return (
    <div className={styles.Card}>
      <div className={styles.CardHeader}>
        <h2 className={styles.CardTitle}>{title}</h2>
        <span
          className={
            status === "completado"
              ? styles.StatusDone
              : styles.StatusInProgress
          }
        >
          {status === "completado" ? "Completado" : "En curso"}
        </span>
      </div>
      <p className={styles.CardDescription}>{description}</p>
      <div className={styles.CardDate}>Added on {formatDate(createdAt)}</div>
      <div className={styles.CardActions}>
        <Button
          className={styles.CompleteBtn}
          onClick={onComplete}
          disabled={status === "completado"}
        >
          Completar
        </Button>
        <Button className={styles.EditBtn} onClick={onEdit}>
          Editar
        </Button>
        <Button className={styles.DeleteBtn} onClick={onDelete}>
          Eliminar
        </Button>
      </div>
    </div>
  );
};

export default Card;

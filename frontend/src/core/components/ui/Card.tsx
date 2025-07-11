import React from "react";
import styles from "../../styles/Card.module.scss";
import Button from "./Button";

interface CardProps {
  title: string;
  description: string;
  status: "completado" | "en curso";
  onDelete: () => void;
  onComplete: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  status,
  onDelete,
  onComplete,
}) => {
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
      <div className={styles.CardActions}>
        <Button
          className={styles.CompleteBtn}
          onClick={onComplete}
          disabled={status === "completado"}
        >
          Completar
        </Button>
        <Button className={styles.DeleteBtn} onClick={onDelete}>
          Eliminar
        </Button>
      </div>
    </div>
  );
};

export default Card;

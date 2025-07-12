import React from "react";
import styles from "../../styles/Modal.module.scss";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.ModalOverlay} onClick={onClose}>
      <div className={styles.ModalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.ModalHeader}>
          <h2 className={styles.ModalTitle}>{title}</h2>
          <button className={styles.CloseButton} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.ModalBody}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;

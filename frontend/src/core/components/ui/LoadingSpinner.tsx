import React from "react";
import styles from "../../styles/LoadingSpinner.module.scss";

const LoadingSpinner: React.FC = () => {
  return (
    <div className={styles.SpinnerContainer}>
      <div className={styles.Spinner}>
        <div className={styles.SpinnerInner}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;

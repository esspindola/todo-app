import React from "react";
import styles from "../../styles/Input.module.scss";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className={styles.InputContainer}>
      {label && <label className={styles.Label}>{label}</label>}
      <input
        className={`${styles.Input} ${
          error ? styles.InputError : ""
        } ${className}`.trim()}
        {...props}
      />
      {error && <span className={styles.ErrorMessage}>{error}</span>}
    </div>
  );
};

export default Input;

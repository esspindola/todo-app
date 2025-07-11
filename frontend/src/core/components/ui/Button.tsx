import React from "react";
import styles from "../../styles/Button.module.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  type = "button",
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      className={`${styles.Button} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

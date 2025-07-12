import React from "react";
import styles from "../../styles/Button.module.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
  href?: string;
}

const Button: React.FC<ButtonProps> = ({
  type,
  children,
  className = "",
  href,
  ...props
}) => {
  if (href) {
    return (
      <a
        href={href}
        className={`${styles.Button} ${className}`.trim()}
        {...(props as any)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type || "submit"}
      className={`${styles.Button} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

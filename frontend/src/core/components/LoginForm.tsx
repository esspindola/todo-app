import { useSnapshot } from "valtio";
import { authStore } from "../store/authStore";
import React, { useState } from "react";
import styles from "../styles/LoginForm.module.scss";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { api } from "../utils/api.service";

interface LoginFormData {
  username: string;
  password: string;
}

interface LoginFormErrors {
  username?: string;
  password?: string;
  general?: string;
}

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof LoginFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await api.login(formData.username, formData.password);

      if (result.access) {
        // Login exitoso con JWT
        const userResult = await api.getUser();
        if (userResult.id || userResult.username) {
          authStore.setUser(
            { username: userResult.username, email: userResult.email },
            result.access,
            result.refresh || ""
          );
          window.location.href = "/";
        }
      } else if (result.detail || result.non_field_errors) {
        // Manejo de errores específicos de Django REST Framework
        const errorMessage =
          result.detail ||
          (result.non_field_errors && result.non_field_errors[0]) ||
          "Login failed. Please check your credentials.";
        setErrors({ general: errorMessage });
      } else {
        setErrors({ general: "Login failed. Please try again." });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: "Connection error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.LoginFormContainer}>
      <div className={styles.LoginForm}>
        <h1 className={styles.Title}>Sign In</h1>
        <p className={styles.Subtitle}>Welcome back to BtYslf</p>

        <form
          method="post"
          autoComplete="off"
          onSubmit={handleSubmit}
          className={styles.Form}
        >
          <Input
            label="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="your username"
            error={errors.username}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Your password"
            error={errors.password}
          />

          {errors.general && (
            <div className={styles.ErrorGeneral}>{errors.general}</div>
          )}

          <Button
            type="submit"
            className={styles.SubmitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className={styles.LoginLink}>
          <span>Don't have an account? </span>
          <a href="/auth/register" className={styles.Link}>
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

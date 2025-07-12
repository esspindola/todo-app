import React, { useState } from "react";
import styles from "../styles/RegisterForm.module.scss";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { api } from "../utils/api.service";

interface RegisterFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormErrors {
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof RegisterFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: RegisterFormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email is not valid";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await api.register(
        formData.email,
        formData.username,
        formData.password,
        formData.confirmPassword
      );

      if (
        (result &&
          (result.id || result.pk || result.email || result.username)) ||
        result.status === 201
      ) {
        window.location.href = "/auth/login";
      } else if (
        result.detail ||
        result.non_field_errors ||
        result.username ||
        result.email ||
        result.password1
      ) {
        // Manejo de errores específicos de Django REST Framework
        const errorMessage =
          result.detail ||
          (result.non_field_errors && result.non_field_errors[0]) ||
          (result.username && result.username[0]) ||
          (result.email && result.email[0]) ||
          (result.password1 && result.password1[0]) ||
          "Registration failed. Please check your information.";
        setErrors({ general: errorMessage });
      } else {
        setErrors({ general: "Registration failed. Please try again." });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ general: "Connection error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.RegisterFormContainer}>
      <div className={styles.RegisterForm}>
        <h1 className={styles.Title}>Sign Up</h1>
        <p className={styles.Subtitle}>Join BtYslf and organize your life</p>

        <form onSubmit={handleSubmit} className={styles.Form}>
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your@email.com"
            error={errors.email}
          />

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

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm your password"
            error={errors.confirmPassword}
          />

          {errors.general && (
            <div className={styles.ErrorGeneral}>{errors.general}</div>
          )}

          <Button
            type="submit"
            className={styles.SubmitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <div className={styles.LoginLink}>
          <span>Already have an account? </span>
          <a href="/auth/login" className={styles.Link}>
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;

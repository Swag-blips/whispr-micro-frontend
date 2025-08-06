import { RegisterPayload } from "@/app/types/auth";

export const validateSignup = (payload: RegisterPayload) => {
  const trimmed = {
    email: payload.email.trim(),
    password: payload.password.trim(),
    confirmPassword: payload.confirmPassword.trim(),
    username: payload.username.trim(),
  };

  const setError = (message: string) => ({
    isValid: false,
    error: message,
  });

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!trimmed.email || !emailRegex.test(trimmed.email)) {
    return setError("Invalid email");
  }

  if (!trimmed.password) {
    return setError("Password is required");
  }

  if (trimmed.password.length < 6) {
    return setError("Password must be at least 6 characters long");
  }

  if (!trimmed.confirmPassword) {
    return setError("Confirm password is required");
  }

  if (trimmed.confirmPassword.length < 6) {
    return setError("Confirm password must be at least 6 characters long");
  }

  if (trimmed.confirmPassword !== trimmed.password) {
    return setError("Passwords do not match");
  }

  if (!trimmed.username) {
    return setError("Username is required");
  }

  if (trimmed.username.length < 6) {
    return setError("Username must be at least 6 characters long");
  }

  return { isValid: true, error: "" };
};

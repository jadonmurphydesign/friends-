import { apiRequest } from "./api";
import { FormikHelpers } from "@/types/formik";
import { SignUpValues } from "@/types/auth";


export const handleSignUp = async (
  values: SignUpValues,
  { setSubmitting, setErrors }: FormikHelpers
): Promise<void> => {
  try {
    await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: values.email, password: values.password }),
    });
  } catch (error) {
    setErrors({ email: 'Email already in use', password: 'Password is too weak' });
  } finally {
    setSubmitting(false);
  }
};

export const handleLogin = async (
  values: { email: string; password: string },
  { setSubmitting, setErrors }: FormikHelpers
): Promise<void> => {
  try {
    await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: values.email, password: values.password }),
    });
  } catch (error) {
    setErrors({ email: 'Invalid email or password', password: 'Invalid email or password' });
  } finally {
    setSubmitting(false);
  }
};

export const handleLogout = async (): Promise<void> => {
    await fetch('/api/auth/logout', { method: 'POST' });
};

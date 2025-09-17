
export interface FormikHelpers {
    setSubmitting: (isSubmitting: boolean) => void;
    setErrors: (errors: { email?: string; password?: string }) => void;
}
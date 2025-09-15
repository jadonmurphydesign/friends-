'use client';

import React from 'react';
import { useField } from 'formik';
import type { InputHTMLAttributes } from 'react';

type FormikInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> & {
  name: string;
  label: string;
  helpText?: string;
  containerClassName?: string;
};

export default function FormikInput({
  name,
  label,
  id,
  className = '',
  helpText,
  containerClassName = '',
  ...rest
}: FormikInputProps) {
  const [field, meta] = useField(name);
  const inputId = id ?? name;
  const errorId = `${inputId}-error`;
  const helpId = `${inputId}-help`;
  const hasError = Boolean(meta.touched && meta.error);

  return (
    <div className={containerClassName}>
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-900">
        {label}
        {rest.required && <span className="text-red-600 ml-0.5">*</span>}
      </label>

      <div className="mt-2">
        <input
          id={inputId}
          {...field}
          {...rest}
          aria-invalid={hasError || undefined}
          aria-describedby={[
            helpText ? helpId : null,
            hasError ? errorId : null,
          ].filter(Boolean).join(' ') || undefined}
          className={[
            'block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900',
            'ring-1 ring-inset ring-gray-300 placeholder:text-gray-400',
            'focus:ring-2 focus:ring-inset focus:ring-indigo-600',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200',
            hasError ? 'ring-red-500 focus:ring-red-500' : '',
            className,
          ].join(' ')}
        />

        {helpText && (
          <p id={helpId} className="mt-1 text-xs text-gray-500">
            {helpText}
          </p>
        )}

        {hasError && (
          <p id={errorId} className="mt-1 text-sm text-red-600">
            {meta.error}
          </p>
        )}
      </div>
    </div>
  );
}

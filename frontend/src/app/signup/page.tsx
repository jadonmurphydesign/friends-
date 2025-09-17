'use client';

import { useRouter } from 'next/navigation';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';
import FormikInput from '../../components/FormikInput';
import { handleSignUp } from '@/services/auth';

const SignupSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(/[a-z]/, 'Password must contain a lowercase letter')
    .matches(/[A-Z]/, 'Password must contain an uppercase letter')
    .matches(/[^a-zA-Z0-9]/, 'Password must contain a special character'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .required('Please confirm your password'),
});

export default function SignupPage() {

  const router = useRouter();

  const signUp = async (
    values: {
      email: string;
      password: string;
      confirmPassword: string;
    },
    {
      setSubmitting,
      setErrors,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      setErrors: (errors: {
        email?: string;
        password?: string;
        confirmPassword?: string;
      }) => void;
    }
  ) => {
    await handleSignUp(values, { setSubmitting, setErrors });
    router.push('/dashboard');
  };
  return (
    <div className="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-10">
          <Image
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            width={40}
            height={40}
            className="mx-auto h-10 w-auto"
            priority
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
        <Formik
          initialValues={{ email: '', password: '', confirmPassword: '' }}
          validationSchema={SignupSchema}
          onSubmit={async (values, { setSubmitting }) => {
            signUp(values, { setSubmitting, setErrors: () => {} });
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <div className="col-span-2">
                  <FormikInput
                    name="email"
                    label="Email address"
                    type="email"
                    required
                    placeholder="Email address"
                    autoComplete="email"
                    className="rounded-t-md"
                  />
                </div>
                <div className="-mt-px">
                  <FormikInput
                    name="password"
                    label="Password"
                    type="password"
                    required
                    placeholder="Password"
                    autoComplete="new-password"
                  />
                </div>
                <div className="-mt-px">
                  <FormikInput
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    required
                    placeholder="Confirm Password"
                    autoComplete="new-password"
                    className="rounded-b-md"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing up...' : 'Sign up'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <p className="text-center text-sm/6 text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

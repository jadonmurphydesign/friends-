'use client';

import { useRouter } from 'next/navigation';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';
import FormikInput from '../../components/FormikInput';
import { handleLogin } from '@/services/auth';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export default function LoginPage() {
    const router = useRouter();

    const login = async (
        values: {
            email: string;
            password: string;
        },
        {
            setSubmitting,
            setErrors,
        }: {
            setSubmitting: (isSubmitting: boolean) => void;
            setErrors: (errors: { email?: string; password?: string }) => void;
        }
    ) => {
        await handleLogin(values, { setSubmitting, setErrors });
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
            Sign in to your account
          </h2>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            login(values, { setSubmitting, setErrors: () => {} });
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
                    autoComplete="current-password"
                    className="rounded-b-md"
                  />
                </div>
              </div>
              {/* ...rest of your form (remember me, forgot password, button, etc.) ... */}
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <p className="text-center text-sm/6 text-gray-500">
          Not a member?{' '}
          <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Start a 14-day free trial
          </a>
        </p>
      </div>
    </div>
  );
}
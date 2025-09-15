'use client';

import { useRef, useState } from 'react';
import { Formik, Form, type FormikProps } from 'formik';
import * as Yup from 'yup';

import Modal from '@/components/Modal';
import FormikInput from '@/components/FormikInput';
import { createFriend } from '@/services/friends';
import type { Friend } from '@/types/friends';

type FormVals = {
  fullName: string;
  age: string | number;
  city: string;
  favoriteColor: string;
  bio: string;
};

const schema = Yup.object({
  fullName: Yup.string().trim().min(2).max(100).required('Name is required'),
  age: Yup.number()
    .transform((v, orig) => (orig === '' ? undefined : Number(orig)))
    .typeError('Age must be a number')
    .min(0)
    .max(150)
    .required('Age is required'),
  city: Yup.string().trim().min(2).max(100).required('City is required'),
  favoriteColor: Yup.string().trim().min(2).max(50).required('Favorite color is required'),
  bio: Yup.string().trim().max(500).notRequired(),
});

const initialValues: FormVals = {
  fullName: '',
  age: '',
  city: '',
  favoriteColor: '',
  bio: '',
};

interface AddFriendModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCreated: (created: Friend) => void;
}

export default function AddFriendModal({ open, setOpen, onCreated }: AddFriendModalProps) {
  const formikRef = useRef<FormikProps<FormVals>>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (values: FormVals) => {
    try {
      const created = await createFriend({
        fullName: values.fullName.trim(),
        age: Number(values.age),
        city: values.city.trim(),
        favoriteColor: values.favoriteColor.trim(),
        bio: values.bio?.trim() || '',
      });
      onCreated(created);
      formikRef.current?.resetForm();
      setOpen(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setSubmitError(e.message ?? 'Failed to create friend');
    } finally {
      formikRef.current?.setSubmitting(false);
    }
  };

  return (
    <Formik<FormVals>
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Modal
          open={open}
          setOpen={setOpen}
          title="Add Friend and Press Enter"
          cancelText="Cancel"
          submitDisabled={isSubmitting}
          submitAction={() => formikRef.current?.submitForm()}
          cancelAction={() => {
            formikRef.current?.resetForm();
            setSubmitError(null);
          }}
          content={
            <Form className="mt-3 space-y-4">
              <FormikInput name="fullName" label="Full Name" placeholder="Full Name" required />
              <FormikInput name="age" label="Age" type="number" placeholder="Age" required />
              <FormikInput name="city" label="City" placeholder="City" required />
              <FormikInput name="favoriteColor" label="Favorite Color" placeholder="Favorite Color" required />
              <FormikInput name="bio" label="Bio" placeholder="Bio" />

              {isSubmitting && <p className="text-sm text-gray-500">Creating friend...</p>}
              {submitError && <p className="text-sm text-red-600">{submitError}</p>}

              <button type="submit" className="hidden" />
            </Form>
          }
        />
      )}
    </Formik>
  );
}

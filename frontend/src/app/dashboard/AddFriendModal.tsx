'use client';

import { useRef, useState } from 'react';
import { Formik, Form, type FormikProps } from 'formik';
import * as Yup from 'yup';

import Modal from '@/components/Modal';
import FormikInput from '@/components/FormikInput';
import { createOrUpdateFriend, deleteFriend } from '@/services/friends';
import type { Friend } from '@/types/friends';

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

interface AddFriendModalProps {
  open: boolean | Friend;
  setOpen: (open: boolean) => void;
  onComplete: (created: Friend, isNew: boolean) => void;
  editValue?: Friend;
}

export default function AddFriendModal({ open, setOpen, onComplete }: AddFriendModalProps) {
  const formikRef = useRef<FormikProps<Friend>>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isEdit =  typeof open === 'object' && 'id' in open ? Boolean(open.id) : false;

  const handleSubmit = async (values: Friend) => {
    const param = {...values};

    if(isEdit) {
      param.id = (open as Friend).id;
    }
    try {
      const created = await createOrUpdateFriend(param, isEdit);
      onComplete(created, false);
      formikRef.current?.resetForm();
      setOpen(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setSubmitError(e.message ?? 'Failed to create friend');
    } finally {
      formikRef.current?.setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!isEdit) return;
    try {
      await deleteFriend((open as Friend).id as string);
      onComplete(open as Friend, true);
      formikRef.current?.resetForm();
      setOpen(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setSubmitError(e.message ?? 'Failed to delete friend');
    } finally {
      formikRef.current?.setSubmitting(false);
    }
  }

  const initialValues: Friend = isEdit ? open as Friend : {
    fullName: '',
    age: '',
    city: '',
    favoriteColor: '',
    bio: '',
  };

  return (
    <Formik<Friend>
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {({ isSubmitting }) => (
        <Modal
          open={open}
          setOpen={setOpen}
          title="Add/Update Friend and Press Enter"
          cancelText="Cancel"
          submitDisabled={isSubmitting || !isEdit}
          submitAction={() => handleDelete()}
          submitText='Delete Friend'
          submitType="severe"
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

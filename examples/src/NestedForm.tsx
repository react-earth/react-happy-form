import React from 'react';
import { FormProvider, native, useForm, useFormContext } from 'react-happy-form';

type FormValues = {
  name?: string;
};

export const NestedForm = () => {
  const form = useForm<FormValues>();

  return (
    <FormProvider value={form}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2>Nested Form</h2>
        <NestedInput />
        <div>{JSON.stringify(form.values)}</div>
      </div>
    </FormProvider>
  );
};

const NestedInput = () => {
  const { field } = useFormContext<FormValues>();

  return <input type="text" {...native(field('name'))} placeholder="enter name" />;
};

import React from 'react';
import { useFormContext } from 'react-happy-form';
import ReactJson from 'react-json-view';
import { ExampleFormValues } from './Example';

export const FormStatePreview = () => {
  const { values, errors, touched, isSubmitted, isSubmitting } =
    useFormContext<ExampleFormValues>();

  return (
    <ReactJson
      name="form"
      src={{
        values,
        // convert errors (map) to object
        errors: Object.fromEntries(errors),
        touched,
        isSubmitted,
        isSubmitting,
      }}
      collapsed={false}
      displayDataTypes={false}
      enableClipboard={false}
    />
  );
};

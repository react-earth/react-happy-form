import React from 'react';
import { useFormContext } from 'react-happy-form';
import ReactJson from 'react-json-view';

export const FormStatePreview = () => {
  const { values, errors, touched, isSubmitted, isSubmitting } =
    useFormContext();

  return (
    <ReactJson
      name="form"
      src={{
        values,
        errors,
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

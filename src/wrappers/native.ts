import { FormField } from '../types';

export const native = (field: FormField) => {
  return {
    ...field,
    value: field.value ?? '',
    // use any to support native like event
    onChange: (event: any) => {
      field.onChange(event.target.value);
    },
  };
};

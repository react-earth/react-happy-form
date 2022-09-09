import { Field } from 'react-happy-form';

export const mui = (field: Field) => {
  return {
    value: field.value,
    onChange: (_: any, value: any) => field.onChange(value),
  };
};

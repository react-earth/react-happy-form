import { Field } from '../hooks';

export const native = (field: Field, defaultValue?: any) => {
  return {
    value: field.value ?? defaultValue ?? '',
    // use any to support custom native like event
    onChange: (event: any) => {
      field.onChange(event.target.value);
    },
  };
};

export const radio = (field: Field, value: any) => {
  return {
    checked: field.value === value,
    onChange: () => {
      field.onChange(value);
    },
  };
};

export const checkbox = (field: Field, value: any) => {
  const formValue: any[] = field.value || [];
  const checked = formValue.includes(value);
  return {
    checked,
    onChange: () => {
      field.onChange(checked ? formValue.filter((item) => item !== value) : [...formValue, value]);
    },
  };
};

import { FormField } from '../types';

type NativeOptions = {
  defaultValue?: any;
};
export const native = (field: FormField, options?: NativeOptions) => {
  return {
    ...field,
    value: field.value ?? options?.defaultValue ?? '',
    // use any to support custom native like event
    onChange: (event: any) => {
      field.onChange(event.target.value);
    },
  };
};

export const radio = (field: FormField, value: any) => {
  return {
    ...field,
    value: undefined,
    checked: field.value === value,
    onChange: () => {
      field.onChange(value);
    },
  };
};

export const checkbox = (field: FormField, value: any) => {
  const fieldValue: any[] = field.value || [];
  const checked = fieldValue.includes(value);
  return {
    ...field,
    value: undefined,
    checked,
    onChange: () => {
      field.onChange(
        checked
          ? fieldValue.filter((item) => item !== value)
          : [...fieldValue, value],
      );
    },
  };
};

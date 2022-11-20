import { FormField } from '../types';

type NativeType = 'text' | 'select' | 'radio' | 'checkbox';

type NativeOptions = {
  type?: NativeType;
  value?: any;
  defaultValue?: any;
};

export const native = (field: FormField, options?: NativeOptions) => {
  switch (options?.type) {
    case 'radio':
      return {
        ...field,
        value: undefined,
        checked: field.value === options?.value,
        onChange: () => {
          field.onChange(options?.value);
        },
      };
    case 'checkbox':
      const fieldValue: any[] = field.value || [];
      const checked = fieldValue.includes(options?.value);
      return {
        ...field,
        value: undefined,
        checked,
        onChange: () => {
          field.onChange(
            checked
              ? fieldValue.filter((item) => item !== options?.value)
              : [...fieldValue, options?.value],
          );
        },
      };
    default:
      return {
        ...field,
        value: field.value ?? options?.defaultValue ?? '',
        // use any to support custom native like event
        onChange: (event: any) => {
          field.onChange(event.target.value);
        },
      };
  }
};

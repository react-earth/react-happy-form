import { FormField } from '../types';

type NativeType = 'text' | 'select' | 'radio' | 'checkbox';

type NativeOptions = {
  type?: NativeType;
  value?: any;
  valueKey?: any;
  defaultValue?: any;
};

export const native = (field: FormField, options?: NativeOptions) => {
  const { type, value, valueKey, defaultValue } = options || {};

  switch (type) {
    case 'radio':
      return {
        ...field,
        value: undefined,
        [valueKey ?? 'checked']: field.value === value,
        onChange: () => {
          field.onChange(value);
          // trigger touched when radio change
          field.onBlur?.();
        },
        ref: field.ref ? (ref: any) => field.ref(ref, value) : undefined,
      };
    case 'checkbox':
      const fieldValue: any[] = field.value || [];
      const checked = fieldValue.includes(value);
      return {
        ...field,
        value: undefined,
        [valueKey ?? 'checked']: checked,
        onChange: () => {
          field.onChange(
            checked
              ? fieldValue.filter((item) => item !== value)
              : [...fieldValue, value],
          );
          // trigger touched when checkbox change
          field.onBlur?.();
        },
        ref: field.ref ? (ref: any) => field.ref(ref, value) : undefined,
      };
    default:
      return {
        ...field,
        value: field.value ?? defaultValue ?? '',
        // use any to support custom native like event
        onChange: (event: any) => {
          field.onChange(event.target.value);
        },
      };
  }
};

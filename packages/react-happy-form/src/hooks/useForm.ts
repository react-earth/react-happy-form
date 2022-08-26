import { useCallback, useState } from 'react';

type RegisterOptions = {
  native?: {
    type: 'text' | 'select' | 'radio' | 'checkbox';
    value?: any;
  };
};

type RegisterReturnsProps = {
  name?: string;
  value?: any;
  checked?: boolean;
  onChange?: (value: any) => void;
};

export const useForm = () => {
  const [values, setValues] = useState<any>();

  const setValue = (path: string, value: any) => {
    setValues((values: any) => {
      return {
        ...values,
        [path]: value,
      };
    });
  };

  return {
    register: useCallback(
      (path: string, options?: RegisterOptions) => {
        const returnProps: RegisterReturnsProps = {};
        if (options?.native) {
          switch (options.native.type) {
            case 'text':
            case 'select':
              returnProps.value = values?.[path] || '';
              returnProps.onChange = (e: any) => setValue(path, e.target.value);
              break;
            case 'radio':
              returnProps.name = path;
              returnProps.checked = values?.[path] === options.native.value;
              returnProps.onChange = () => setValue(path, options.native?.value);
              break;
            case 'checkbox':
              returnProps.name = path;
              returnProps.checked = Boolean(values?.[path]?.includes(options.native.value));
              returnProps.onChange = () => {
                if (returnProps.checked) {
                  setValue(path, values?.[path].filter((value: any) => value !== options.native?.value) || []);
                } else {
                  setValue(path, [...(values?.[path] || []), options.native?.value]);
                }
              };
              break;
          }
        } else {
          returnProps.value = values?.[path];
          returnProps.onChange = (value: any) => setValue(path, value);
        }
        return returnProps;
      },
      [values]
    ),
    values,
    setValue,
    setValues,
  };
};

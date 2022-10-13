import { useState } from 'react';
import { Path } from '../types';
import { set, get } from '../utils';

type UseFormOptions<T> = {
  defaultValues?: T;
};

export type Field = {
  value: any;
  onChange: (value: any) => void;
};
export type Form<T extends object = any> = ReturnType<typeof useForm<T>>;

export const useForm = <T extends object = any>(options?: UseFormOptions<T>) => {
  const { defaultValues } = options || {};

  const [values, setValues] = useState<T | undefined>(defaultValues);

  const setValue = (path: Path<T>, value: any) => {
    setValues((values: any) => {
      const shallowClone = { ...values };
      set(shallowClone, path, value);
      return shallowClone;
    });
  };

  return {
    field: (path: Path<T>): Field => ({
      value: get(values || {}, path) as any,
      onChange: (value: any) => setValue(path, value),
    }),
    values,
    setValue,
    setValues,
  };
};

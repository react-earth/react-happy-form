import { useState } from 'react';
import get from 'lodash/fp/get';
import set from 'lodash/fp/set';
import { Path } from '../types';

type UseFormOptions<T> = {
  defaultValues?: T;
};

export type Field = {
  value: any;
  onChange: (value: any) => void;
};
export type Form<T = any> = ReturnType<typeof useForm<T>>;

export const useForm = <T = any>(options?: UseFormOptions<T>) => {
  const { defaultValues } = options || {};

  const [values, setValues] = useState<T | undefined>(defaultValues);

  const setValue = (path: Path<T>, value: any) => {
    setValues((values?: T) => set(path, value, values as any) as any);
  };

  return {
    field: (path: Path<T>): Field => ({
      value: get(path, values as any) as any,
      onChange: (value: any) => setValue(path, value),
    }),
    values,
    setValue,
    setValues,
  };
};

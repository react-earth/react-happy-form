import {useEffect, useState} from 'react';
import get from 'lodash/fp/get';
import set from 'lodash/fp/set';
import {Path} from '../types';

type UseFormOptions<T> = {
  defaultValues?: T;
  validate?: (values: T) => Promise<{errors: Record<string, string>}>;
};

export type Field = {
  value: any;
  onChange: (value: any) => void;
  error: string | undefined;
};
export type Form<T = any> = ReturnType<typeof useForm<T>>;

export const useForm = <T = any>(options?: UseFormOptions<T>) => {
  const {defaultValues} = options || {};

  const [values, setValues] = useState<T | undefined>(defaultValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setValue = (path: Path<T>, value: any) => {
    setValues((values?: T) => set(path, value, values as any) as any);
  };

  const _executeSchema = async () => {
    const {errors} = (await options?.validate?.(values as T)) || {errors: {}};
    setErrors(errors);
  };

  useEffect(() => {
    if (options?.validate) {
      _executeSchema();
    }
  }, [values]);

  return {
    field: (path: Path<T>): Field => ({
      value: get(path, values as any) as any,
      onChange: (value: any) => setValue(path, value),
      error: get(path, errors) as any,
    }),
    values,
    setValue,
    setValues,
    errors,
  };
};

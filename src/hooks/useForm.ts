import { useState } from 'react';
import { Path } from '../types';
import {set,get} from '../utils';


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
    setValues((values?: T) => set(values as any, path, value) as any);
  };

  return {
    field: (path: Path<T>): Field => ({
      value: get(values as any,path) as any,
      onChange: (value: any) => setValue(path, value),
    }),
    values,
    setValue,
    setValues,
  };
};

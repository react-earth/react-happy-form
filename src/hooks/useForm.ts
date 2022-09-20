import {useEffect, useState} from 'react';
import get from 'lodash/fp/get';
import set from 'lodash/fp/set';
import {Path} from '../types';

type UseFormOptions<T> = {
  defaultValues?: T;
  validate?: (values: T) => Promise<{errors: Record<string, string>}>;
  onSubmit?: (values: T) => void;
  onSubmitError?: (error: unknown) => void;
};

export type Field = {
  value: any;
  onChange: (value: any) => void;
  onFocus: () => void;
  onBlur: () => void;
};
export type Form<T = any> = ReturnType<typeof useForm<T>>;

export const useForm = <T = any>(options?: UseFormOptions<T>) => {
  const {defaultValues, onSubmit, onSubmitError} = options || {};

  const [values, setValues] = useState<T | undefined>(defaultValues);
  const [touchedPaths, setTouchedPaths] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  const setValue = (path: Path<T>, value: any) => {
    setValues((values?: T) => set(path, value, values as any) as any);
  };

  const _executeSchema = async (forcedValidate = false) => {
    const {errors} = (await options?.validate?.(values as T)) || {errors: {}};
    const errorKeys = Object.keys(errors);

    !forcedValidate &&
      errorKeys.forEach((key) => {
        if (!touchedPaths.includes(key)) {
          delete errors[key];
        }
      });

    setErrors(errors);
    return errors;
  };

  useEffect(() => {
    if (options?.validate) {
      _executeSchema();
    }
  }, [values]);

  const submit = async () => {
    const errors = await _executeSchema(true);
    const hasErrors = Object.keys(errors).length > 0;

    if (!hasErrors && values) {
      setSubmitting(true);
      try {
        await onSubmit?.(values);
      } catch (error) {
        if (onSubmitError) {
          onSubmitError(error);
        }
      }
      setSubmitting(false);
    }
  };

  return {
    field: (path: Path<T>): Field => ({
      value: get(path, values as any) as any,
      onChange: (value: any) => {
        if (!touchedPaths.includes(path)) {
          setTouchedPaths([...touchedPaths, path]);
        }
        setValue(path, value);
      },
      onFocus: () => {
        if (!touchedPaths.includes(path)) {
          setTouchedPaths([...touchedPaths, path]);
        }
      },
      onBlur: () => {
        _executeSchema();
      },
    }),
    values,
    setValue,
    setValues,
    errors,
    submit,
    submitting,
  };
};

import { FormEvent, useEffect, useState } from 'react';
import { FormErrors, FormField, Path, PromiseAble } from '../types';
import { set, get } from '../utils';

type UseFormOptions<T extends object> = {
  defaultValues?: T;
  validate?: (values: T) => PromiseAble<FormErrors<T>>;
};

export const useForm = <T extends object = any>(
  options?: UseFormOptions<T>,
) => {
  const { defaultValues, validate } = options || {};

  const [formState, setFormState] = useState({
    values: defaultValues ?? ({} as T),
    errors: new Map() as FormErrors<T>,
    // refs: {} as Record<Path<T>, any>,
    touched: [] as Path<T>[],
    isSubmitted: false,
    isSubmitting: false,
  });

  const getValue = (path: Path<T>) => get(formState.values, path);
  const setValue = (path: Path<T>, value: any) => {
    setFormState((formState) => {
      const newValues = { ...formState.values };
      set(newValues, path, value);
      return { ...formState, values: newValues };
    });
  };
  const setValues = (values: T) => {
    setFormState((formState) => {
      return { ...formState, values };
    });
  };
  const touch = (path: Path<T>) => {
    setFormState((formState) => {
      if (formState.touched.includes(path)) {
        return formState;
      } else {
        return { ...formState, touched: [...formState.touched, path] };
      }
    });
  };
  const getError = (path: Path<T>) => formState.errors.get(path);
  const setError = (path: Path<T>, error?: any) => {
    setFormState((formState) => {
      // if error is false, remove it, else set to errors
      const newErrors = new Map(formState.errors);
      if (error) {
        newErrors.set(path, error);
      } else {
        newErrors.delete(path);
      }
      return {
        ...formState,
        errors: newErrors,
      };
    });
  };
  const setErrors = (errors: FormErrors<T>) => {
    setFormState((formState) => {
      return { ...formState, errors };
    });
  };
  const setIsSubmitted = (isSubmitted: boolean) => {
    setFormState((formState) => {
      return { ...formState, isSubmitted };
    });
  };
  const setIsSubmitting = (isSubmitting: boolean) => {
    setFormState((formState) => {
      return { ...formState, isSubmitting };
    });
  };

  useEffect(() => {
    (async () => {
      if (validate) {
        const errors = await validate(formState.values);
        if (formState.isSubmitted) {
          setErrors(errors);
        } else {
          // if is not submitted, only set errors on touched fields
          const touchedErrors: FormErrors<T> = new Map();
          formState.touched.forEach((path) => {
            const pathError = errors.get(path);
            if (pathError) {
              touchedErrors.set(path, pathError);
            }
          });
          setErrors(touchedErrors);
        }
      }
    })();
  }, [formState.isSubmitted, formState.touched, formState.values]);

  const handleSubmit =
    (onSubmit: (values: T) => PromiseAble<void>) =>
    async (event?: FormEvent) => {
      console.log(event);
      event?.preventDefault?.();
      try {
        console.log(1);
        setIsSubmitting(true);
        const errors = (await validate?.(formState.values)) || new Map();
        setErrors(errors);
        if (errors.size === 0) {
          await onSubmit(formState.values);
        }
      } finally {
        console.log(2);
        setIsSubmitted(true);
        setIsSubmitting(false);
      }
    };

  return {
    ...formState,
    field: (path: Path<T>): FormField => ({
      value: getValue(path),
      onChange: (value: any) => setValue(path, value),
      onBlur: () => touch(path),
      // ref: (ref: any) => setR
    }),
    getValue,
    setValue,
    setValues,
    touch,
    getError,
    setError,
    setErrors,
    setIsSubmitted,
    setIsSubmitting,
    handleSubmit,
  };
};

export type Form<T extends object = any> = ReturnType<typeof useForm<T>>;

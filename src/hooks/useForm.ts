import { useEffect, useState } from 'react';
import { FormErrors, FormField, Path, PromiseAble } from '../types';
import { set, get } from '../utils';

type UseFormOptions<T extends object> = {
  defaultValues?: T;
  validate?: (values: T) => PromiseAble<FormErrors>;
};

export const useForm = <T extends object = any>(
  options?: UseFormOptions<T>,
) => {
  const { defaultValues, validate } = options || {};

  const [formState, setFormState] = useState({
    values: defaultValues ?? ({} as T),
    errors: {} as FormErrors,
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
  const getError = (path: Path<T>) => get(formState.errors, path);
  const setError = (path: Path<T>, error: any) => {
    setFormState((formState) => {
      const newErrors = { ...formState.errors };
      set(newErrors, path, error);
      return { ...formState, errors: newErrors };
    });
  };
  const setErrors = (errors: FormErrors) => {
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
      if (validate && (formState.isSubmitted || formState.touched.length > 0)) {
        const errors = await validate(formState.values);
        if (formState.isSubmitted) {
          setErrors(errors);
        } else {
          const touchedErrors: FormErrors = {};
          formState.touched.forEach((path) => {
            const pathError = get(errors, path);
            if (pathError) {
              set(touchedErrors, path, pathError);
            }
          });
          setErrors(touchedErrors);
        }
      }
    })();
  }, [formState.isSubmitted, formState.touched, formState.values]);

  const handelSubmit =
    (onSubmit: (values: T) => PromiseAble<void>) => async () => {
      console.log(1);
      try {
        setIsSubmitting(true);
        const errors = (await validate?.(formState.values)) || {};
        setErrors(errors);
        if (Object.keys(errors).length === 0) {
          await onSubmit(formState.values);
        }
      } finally {
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
      error: getError(path),
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
    handelSubmit,
  };
};

export type Form<T extends object = any> = ReturnType<typeof useForm<T>>;

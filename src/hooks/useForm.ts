import { useEffect, useState } from 'react';
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
    errors: {} as FormErrors<T>,
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
      return { ...formState, errors: { ...formState.errors, [path]: error } };
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
          const touchedErrors: FormErrors<T> = {};
          formState.touched.forEach((touchedPath) => {
            if (errors[touchedPath]) {
              touchedErrors[touchedPath] = errors[touchedPath];
            }
          });
          setErrors(touchedErrors);
        }
      }
    })();
  }, [formState.isSubmitted, formState.touched, formState.values]);

  const handleSubmit =
    (onSubmit: (values: T) => PromiseAble<void>) => async () => {
      try {
        setIsSubmitting(true);
        const errors = (await validate?.(formState.values)) || {};
        setErrors(errors);
        if (Object.keys(errors).length === 0) {
          await onSubmit(formState.values);
        }
      } finally {
        // todo: if the onSubmit is not call, is the isSubmitted should be false?
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

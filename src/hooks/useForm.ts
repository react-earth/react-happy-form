import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  FormErrors,
  FormField,
  FormFieldRefs,
  Path,
  PromiseAble,
} from '../types';
import { set, get } from '../utils';

type UseFormOptions<T extends object> = {
  defaultValues?: T;
  onValidate?: (values: T) => PromiseAble<FormErrors<T>>;
  onSubmit?: (values: T) => PromiseAble<void>;
  isValidateOnTouched?: boolean;
  isFocusOnValidateFailed?: boolean;
};

type FieldOptions = {
  onBlur?: boolean;
  ref?: boolean;
};

export const useForm = <T extends object = any>(
  options?: UseFormOptions<T>,
) => {
  const {
    defaultValues,
    onValidate,
    onSubmit,
    isValidateOnTouched,
    isFocusOnValidateFailed,
  } = options || {};

  const [formState, setFormState] = useState({
    values: (defaultValues ?? {}) as T,
    errors: new Map() as FormErrors<T>,
    touched: [] as Path<T>[],
    isSubmitted: false,
    isSubmitting: false,
  });

  const fieldRefs = useRef<FormFieldRefs<T>>({});

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
  const hasError = (path: Path<T>) => Boolean(getError(path));
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
  const getFieldRef = (path: Path<T>) => {
    const fieldRef = fieldRefs.current[path] as any;
    if (fieldRef instanceof Map) {
      // get first item if fieldRef is map
      return fieldRef.values().next().value;
    } else {
      return fieldRef;
    }
  };
  const setFieldRef = (path: Path<T>, ref: any) => {
    if (ref) {
      fieldRefs.current[path] = ref;
    } else {
      delete fieldRefs.current[path];
    }
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

  const submit = async (event?: FormEvent) => {
    event?.preventDefault?.();
    try {
      setIsSubmitting(true);
      const errors = (await onValidate?.(formState.values)) || new Map();
      setErrors(errors);
      if (errors.size === 0) {
        await onSubmit?.(formState.values);
      } else if (isFocusOnValidateFailed) {
        // focus first invalid field
        const firstInvalidPath = errors.keys().next().value;
        getFieldRef(firstInvalidPath)?.focus?.();
      }
    } finally {
      setIsSubmitted(true);
      setIsSubmitting(false);
    }
  };

  // validation
  useEffect(() => {
    (async () => {
      if (onValidate) {
        const errors = await onValidate(formState.values);
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

  return {
    ...formState,
    field: (path: Path<T>, options?: FieldOptions): FormField => ({
      value: getValue(path),
      onChange: (value: any) => setValue(path, value),
      onBlur:
        options?.onBlur ?? isValidateOnTouched ? () => touch(path) : undefined,
      ref:
        options?.ref ?? isFocusOnValidateFailed
          ? (ref: any) => setFieldRef(path, ref)
          : undefined,
    }),
    getValue,
    setValue,
    setValues,
    touch,
    getError,
    hasError,
    setError,
    setErrors,
    fieldRefs: fieldRefs.current,
    getFieldRef,
    setFieldRef,
    setIsSubmitted,
    setIsSubmitting,
    submit,
  };
};

export type Form<T extends object = any> = ReturnType<typeof useForm<T>>;

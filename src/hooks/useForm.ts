import { FormEvent, useEffect, useRef, useState } from 'react';
import { Path, PathValue, pathGet, pathSet } from 'object-standard-path';
import {
  FormErrors,
  StandardFieldProps,
  FormFieldRefs,
  PromiseAble,
} from '../types';

type UseFormOptions<T = any> = {
  defaultValues?: T;
  onValidate?: (values: T) => PromiseAble<FormErrors<T>>;
  onSubmit?: (values: T) => PromiseAble<void>;
  isValidateOnChange?: boolean;
  isValidateAfterTouch?: boolean;
  isAutoFocus?: boolean;
};

type FieldOptions = Pick<
  UseFormOptions,
  'isValidateAfterTouch' | 'isAutoFocus'
>;

export const useForm = <T = any>(options?: UseFormOptions<T>) => {
  const {
    defaultValues,
    onValidate,
    onSubmit,
    isValidateOnChange,
    isValidateAfterTouch,
    isAutoFocus,
  } = options || {};

  const [formState, setFormState] = useState({
    values: defaultValues as T,
    errors: new Map() as FormErrors<T>,
    touched: [] as Path<T>[],
    isSubmitted: false,
    isSubmitting: false,
  });

  const fieldRefs = useRef<FormFieldRefs<T>>({});

  const getValue = <P extends Path<T>>(path: P) =>
    pathGet(formState.values, path);
  const setValue = <P extends Path<T>>(path: P, value: PathValue<T, P>) => {
    setFormState((formState) => {
      const newValues = { ...formState.values };
      pathSet(newValues, path, value);
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
  const getFieldRef = (path: Path<T>) => fieldRefs.current[path];
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
      } else if (isAutoFocus) {
        // focus first invalid field
        const firstInvalidPath = errors.keys().next().value;
        getFieldRef(firstInvalidPath)?.focus?.();
      }
    } finally {
      setIsSubmitted(true);
      setIsSubmitting(false);
    }
  };

  // validate on change
  useEffect(() => {
    (async () => {
      if (isValidateOnChange && onValidate) {
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

  const field = (
    path: Path<T>,
    options?: FieldOptions,
  ): StandardFieldProps => ({
    value: getValue(path),
    onChange: (value: any) => setValue(path, value),
    onBlur:
      options?.isValidateAfterTouch ?? isValidateAfterTouch
        ? () => touch(path)
        : undefined,
    ref:
      options?.isAutoFocus ?? isAutoFocus
        ? (ref: any) => setFieldRef(path, ref)
        : undefined,
  });

  return {
    ...formState,
    field,
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

export type Form<T = any> = ReturnType<typeof useForm<T>>;

import { createContext, useContext } from 'react';
import { Form } from './useForm';

const FormContext = createContext<Form<any>>(undefined!);

export const FormProvider = FormContext.Provider;

export const useFormContext = <T extends object>(): Form<T> => {
  const formContext = useContext(FormContext);
  if (formContext === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return formContext;
};

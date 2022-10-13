import { createContext, useContext } from 'react';
import { Form } from '../hooks';

const FormContext = createContext<Form>({} as Form);

export const FormProvider = FormContext.Provider;

export const useFormContext = <T extends object = any>(): Form<T> => {
  return useContext(FormContext);
};

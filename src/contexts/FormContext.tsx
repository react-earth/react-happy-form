import { createContext, useContext } from 'react';
import { Form } from '../hooks';

const FormContext = createContext<Form>({} as Form);

export const FormProvider = FormContext.Provider;

export const useFormContext = <T,>(): Form<T> => {
  return useContext(FormContext);
};

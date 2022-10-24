import { PromiseAble } from '../types';

type validateFun = (
  value: any,
  field: string,
  form: Record<string, any>,
) => PromiseAble<string | undefined>;

export const createValidator = (
  validateObject: Record<string, validateFun[]>,
) => {
  const validateAt = async (field: string, form: Record<string, any>) => {
    let error: string | undefined;
    const validators = validateObject[field];

    for (let index = 0, length = validators.length; index < length; index++) {
      error = await validators[index](form[field], field, form);
      if (error) {
        break;
      }
    }

    return error;
  };

  const validate = async (form: Record<string, any>) => {
    const keys = Object.keys(form);
    const errors: Record<string, string> = {};

    for (let index = 0, length = keys.length; index < length; index++) {
      const key = keys[index];
      const error = await validateAt(key, form);
      if (error) {
        errors[key] = error;
      }
    }

    return errors;
  };

  return {
    validate,
    validateAt,
  };
};

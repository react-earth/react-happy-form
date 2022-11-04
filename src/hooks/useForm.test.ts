import { useForm } from './useForm';
import { act, renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';

function renderUseForm(validate?: (value: any) => any) {
  return renderHook(() =>
    useForm({
      validate,
      defaultValues: {
        name: 'name',
        age: 18,
        hobbies: ['cycle', 'swimming'],
        transaction: {
          start: new Date(),
          end: new Date(),
        },
      },
    }),
  );
}
describe('useForm', () => {
  it('we can get value by path', () => {
    const { result } = renderUseForm();
    const { getValue } = result.current;
    expect(getValue('age')).toBe(18);
    expect(getValue('transaction.end')).toBeInstanceOf(Date);
  });
  it('we can set property by setValue method', () => {
    const { result } = renderUseForm();
    const { setValue } = result.current;

    const currentDate = new Date();
    act(() => {
      setValue('transaction.end', currentDate);
    });
    expect(result.current.values.transaction.end).toBe(currentDate);
  });
  it('we can set multiple properties by use setValues method', () => {
    const { result } = renderUseForm();
    const { setValues } = result.current;

    const values = {
      name: 'test name',
      age: 20,
      hobbies: ['test1', 'test2'],
    };
    act(() => {
      // todo: should we can make those property optional?
      // i prefer to provider a option: merge/replace(default)
      setValues(values as any);
    });
    expect(result.current.values).toBe(values);
  });
  it('the touch method should work normally', () => {
    const { result } = renderUseForm();
    const { touch } = result.current;

    act(() => {
      touch('name');
      touch('transaction');
    });
    expect(result.current.touched).toStrictEqual(['name', 'transaction']);
  });
  it('we can set a single error message by setError method', () => {
    const { result } = renderUseForm();
    const { setError } = result.current;

    const errorMsg = 'this field is required';
    act(() => {
      setError('age', errorMsg);
    });
    expect(result.current.errors['age']).toBe(errorMsg);
  });
  it('we can set multiple error messages by setErrors method', () => {
    const { result } = renderUseForm();
    const { setErrors } = result.current;

    const errorMsg = 'this field is required';
    const errorObject = {
      age: errorMsg,
      name: errorMsg,
      hobbies: errorMsg,
      'transaction.end': errorMsg,
    };
    act(() => {
      setErrors(errorObject);
    });
    expect(result.current.errors).toMatchObject(errorObject);
  });
  it('we can flag the isSubmitted property by setIsSubmitted', () => {
    const { result } = renderUseForm();
    const { setIsSubmitted } = result.current;
    expect(result.current.isSubmitted).toBeFalsy();

    act(() => {
      setIsSubmitted(true);
    });
    expect(result.current.isSubmitted).toBe(true);
  });
  it('we can flag the isSubmitting property by setIsSubmitting', async () => {
    const { result } = renderUseForm();
    const { setIsSubmitting } = result.current;
    expect(result.current.isSubmitting).toBeFalsy();

    act(() => {
      setIsSubmitting(true);
    });
    expect(result.current.isSubmitting).toBe(true);
  });
  it('the handleSubmit should work normally', async () => {
    const onSubmit = jest.fn();
    const { result } = renderUseForm(jest.fn());
    const { handleSubmit } = result.current;

    act(() => {
      handleSubmit(onSubmit)();
    });
    expect(result.current.isSubmitting).toBe(true);
    await waitFor(() => expect(onSubmit).toBeCalled);
    expect(result.current.isSubmitted).toBe(true);
  });
  it('onSubmit should not be called if the validation result is an error object', async () => {
    const validate = jest.fn(() => {
      return {
        name: 'the name field is required',
      };
    });
    const onSubmit = jest.fn();
    const { result } = renderUseForm(validate);
    const { handleSubmit } = result.current;

    await act(async () => {
      await handleSubmit(onSubmit)();
    });
    expect(onSubmit).toBeCalledTimes(0);
    expect(result.current.isSubmitted).toBeTruthy();
  });
  it('the field function should work normally', () => {
    const { result } = renderUseForm();
    const { field } = result.current;

    expect(field('transaction.end')).toMatchObject({
      value: expect.any(Date),
      onChange: expect.any(Function),
      onBlur: expect.any(Function),
    });
  });
});

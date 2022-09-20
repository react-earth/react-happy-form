import React from 'react';
import {radio, native, checkbox, useForm} from 'react-happy-form';
import {yupValidator} from 'react-happy-form-yup';
import * as y from 'yup';

const formSchema = y.object({
  name: y.string().required(),
  sex: y.string().required(),
  hobbies: y.array().min(1).required(),
  access: y.string().required(),
});

type FormValues = {
  name?: string;
  sex?: string;
  hobbies?: string[];
  access?: string;
};

export const NativeForm = () => {
  const {field, values, errors, submit} = useForm<FormValues>({
    defaultValues: {
      sex: 'male',
      access: 'public',
    },
    validate: yupValidator(formSchema),
  });

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
      <h2>Native Form</h2>
      <input type="text" {...native(field('name'))} placeholder="enter name" />
      <div>
        <label>
          <input type="radio" {...radio(field('sex'), 'male')} />
          Male
        </label>
        <label>
          <input type="radio" {...radio(field('sex'), 'female')} />
          Female
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" {...checkbox(field('hobbies'), 'swimming')} />
          Swimming
        </label>
        <label>
          <input type="checkbox" {...checkbox(field('hobbies'), 'running')} />
          Running
        </label>
        <label>
          <input type="checkbox" {...checkbox(field('hobbies'), 'basketball')} />
          Basketball
        </label>
      </div>
      <select {...native(field('access'))}>
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select>
      <button onClick={submit}>submit</button>
      <div>{JSON.stringify(values)}</div>
      <div>errors: {JSON.stringify(errors, null, 2)}</div>
    </div>
  );
};

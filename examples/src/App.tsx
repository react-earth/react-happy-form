import React from 'react';
import { useForm } from 'react-happy-form';

export const App = () => {
  const { register, values } = useForm();

  console.log(values);

  return (
    <div>
      <div>
        <input type="text" {...register('name', { native: { type: 'text' } })} placeholder="enter name" />
      </div>
      <div>
        <label>Man</label>
        <input type="radio" checked={false} onChange={() => {}} />
        <label>Female</label>
        <input type="radio" />
      </div>
    </div>
  );
};

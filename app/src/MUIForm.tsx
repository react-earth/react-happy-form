import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@mui/material';
import React from 'react';
import {native, checkbox, useForm} from 'react-happy-form';

type FormValues = {
  name?: string;
  sex?: string;
  hobbies?: string[];
  access?: string;
};

export const MUIForm = () => {
  const {field, values} = useForm<FormValues>({
    defaultValues: {
      sex: 'male',
      access: 'public',
    },
  });

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
      <h2>MUI Form</h2>
      <TextField {...native(field('name'))} placeholder="enter name" />
      <RadioGroup {...native(field('sex'))}>
        <FormControlLabel value="male" control={<Radio />} label="Male" />
        <FormControlLabel value="female" control={<Radio />} label="Female" />
      </RadioGroup>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox {...checkbox(field('hobbies'), 'swimming')} />}
          label="Swimming"
        />
        <FormControlLabel
          control={<Checkbox {...checkbox(field('hobbies'), 'running')} />}
          label="Running"
        />
        <FormControlLabel
          control={<Checkbox {...checkbox(field('hobbies'), 'basketball')} />}
          label="Basketball"
        />
      </FormGroup>
      <Select {...native(field('access'))}>
        <MenuItem value="public">Public</MenuItem>
        <MenuItem value="private">Private</MenuItem>
      </Select>
      <div>{JSON.stringify(values)}</div>
    </div>
  );
};

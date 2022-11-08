import React, { useState } from 'react';
import { native, useForm, FormErrors, FormProvider } from 'react-happy-form';
import {
  Alert,
  Box,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  Snackbar,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormStatePreview } from './FormStatePreview';

type FormValues = {
  name?: string;
  sex?: string;
  hobbies?: string[];
  privacy?: string;
};

export const Example = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      sex: 'male',
      privacy: 'public',
    },
    validate: (values) => {
      const errors: FormErrors<FormValues> = {};
      if (!values.name) {
        errors.name = 'Please enter your name';
      }
      if (!values.hobbies || values.hobbies.length === 0) {
        errors.hobbies = 'Please select hobbies';
      }
      return errors;
    },
  });
  const [isShowToast, setIsShowToast] = useState(false);
  const { field, errors, isSubmitting, handleSubmit } = form;

  const onSubmit = async (values: FormValues) => {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(undefined);
      }, 1000);
    });
    setIsShowToast(true);
  };

  return (
    <FormProvider value={form}>
      <Container
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 32,
          padding: 16,
        }}
      >
        <Box style={{ width: 500 }}>
          <Typography variant="h4">React Happy Form</Typography>
          <Box
            style={{
              marginTop: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <FormControl error={Boolean(errors.name)}>
              <FormLabel required>Name</FormLabel>
              <TextField
                {...native(field('name'))}
                error={Boolean(errors.name)}
                placeholder="enter name"
              />
              {errors.name && (
                <FormHelperText error>{errors.name}</FormHelperText>
              )}
            </FormControl>
            <FormControl>
              <FormLabel required>Sex</FormLabel>
              <RadioGroup {...native(field('sex'))} row>
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
              </RadioGroup>
            </FormControl>
            <FormControl error={Boolean(errors.hobbies)}>
              <FormLabel required>Hobbies</FormLabel>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      {...native(field('hobbies'), {
                        type: 'checkbox',
                        value: 'swimming',
                      })}
                    />
                  }
                  label="Swimming"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      {...native(field('hobbies'), {
                        type: 'checkbox',
                        value: 'running',
                      })}
                    />
                  }
                  label="Running"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      {...native(field('hobbies'), {
                        type: 'checkbox',
                        value: 'basketball',
                      })}
                    />
                  }
                  label="Basketball"
                />
              </FormGroup>
              {errors.hobbies && (
                <FormHelperText error>{errors.hobbies}</FormHelperText>
              )}
            </FormControl>
            <FormControl>
              <FormLabel required>Privacy</FormLabel>
              <Select {...native(field('privacy'))}>
                <MenuItem value="public">Everyone can view</MenuItem>
                <MenuItem value="friends">Your friends can view</MenuItem>
                <MenuItem value="private">Only your can view</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <LoadingButton
                variant="contained"
                loading={isSubmitting}
                onClick={handleSubmit(onSubmit)}
              >
                Submit
              </LoadingButton>
            </FormControl>
          </Box>
        </Box>
        <Box style={{ width: 400 }}>
          <Typography variant="h4">State</Typography>
          <Box style={{ marginTop: 16 }}>
            <FormStatePreview />
          </Box>
        </Box>
      </Container>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={isShowToast}
        autoHideDuration={2000}
        onClose={() => setIsShowToast(false)}
      >
        <Alert severity="success">Form Submit Successfully!</Alert>
      </Snackbar>
    </FormProvider>
  );
};

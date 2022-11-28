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
      const errors: FormErrors<FormValues> = new Map();
      if (!values.name) {
        errors.set('name', 'Please enter your name');
      }
      if (!values.hobbies || values.hobbies.length === 0) {
        errors.set('hobbies', 'Please select your hobbies');
      }
      return errors;
    },
  });
  const { field, isSubmitting, handleSubmit, getError } = form;
  const [isShowToast, setIsShowToast] = useState(false);

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
      <form onSubmit={handleSubmit(onSubmit)}>
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
              <FormControl error={Boolean(getError('name'))}>
                <FormLabel required>Name</FormLabel>
                <TextField
                  {...native(field('name'))}
                  error={Boolean(getError('name'))}
                  placeholder="enter name"
                />
                {getError('name') && (
                  <FormHelperText error>{getError('name')}</FormHelperText>
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
              <FormControl error={Boolean(getError('hobbies'))}>
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
                {getError('hobbies') && (
                  <FormHelperText error>{getError('hobbies')}</FormHelperText>
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
                  type="submit"
                  // onClick={handleSubmit(onSubmit)}
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
      </form>
    </FormProvider>
  );
};

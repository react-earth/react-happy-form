import React from 'react';
import { native, useForm, FormErrors, FormProvider } from 'react-happy-form';
import {
  Box,
  Container,
  Flex,
  Heading,
  Spacer,
  Input,
  Stack,
  Radio,
  Checkbox,
  Select,
  Button,
  useToast,
} from '@chakra-ui/react';
import { FormStatePreview } from './components/FormStatePreview';
import { Form } from './components/Form';
import { FormItem } from './components/FormItem';

const RADIO_ITEMS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

const CHECKBOX_ITEMS = [
  { label: 'Swimming', value: 'swimming' },
  { label: 'Running', value: 'running' },
];

const SELECT_ITEMS = [
  { label: 'Everyone can view', value: 'public' },
  { label: 'Your friends can view', value: 'friends' },
  { label: 'Only your can view', value: 'private' },
];

export type ExampleFormValues = {
  name?: string;
  sex?: string;
  hobbies?: string[];
  privacy?: string;
};

export const Example = () => {
  const form = useForm<ExampleFormValues>({
    defaultValues: {
      sex: 'male',
      privacy: 'public',
    },
    validate: (values) => {
      const errors: FormErrors<ExampleFormValues> = new Map();
      if (!values.name) {
        errors.set('name', 'Name is required');
      }
      if (!values.hobbies || values.hobbies.length === 0) {
        errors.set('hobbies', 'Hobbies is required');
      }
      return errors;
    },
    validateOnTouched: true,
    focusOnValidateFailed: true,
  });
  const { field, isSubmitting, handleSubmit, hasError, getError, setFieldRef } =
    form;
  const toast = useToast();

  const onSubmit = async (values: ExampleFormValues) => {
    // wait 1s for submitting
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(values);
      }, 1000);
    });
    toast({
      title: 'Form submit successfully!',
      position: 'top',
      status: 'success',
    });
  };

  return (
    <FormProvider value={form}>
      <Container maxW="container.lg">
        <Spacer h="12" />
        <Flex gap="12">
          <Box flex="1">
            <Heading fontSize="3xl">React Happy Form</Heading>
            <Spacer h="6" />
            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormItem label="Name" required error={getError('name')}>
                <Input
                  {...native(field('name'))}
                  placeholder="Please enter your name"
                  isInvalid={hasError('name')}
                />
              </FormItem>
              <FormItem label="Sex" required error={getError('sex')}>
                <Stack direction="row" gap="2">
                  {RADIO_ITEMS.map((item) => (
                    <Radio
                      key={item.value}
                      {...native(field('sex'), {
                        type: 'radio',
                        value: item.value,
                        valueKey: 'isChecked',
                      })}
                      isInvalid={hasError('sex')}
                    >
                      {item.label}
                    </Radio>
                  ))}
                </Stack>
              </FormItem>
              <FormItem label="Hobbies" required error={getError('hobbies')}>
                <Stack direction="row" gap="2">
                  {CHECKBOX_ITEMS.map((item) => (
                    <Checkbox
                      key={item.value}
                      {...native(field('hobbies'), {
                        type: 'checkbox',
                        value: item.value,
                        valueKey: 'isChecked',
                      })}
                      isInvalid={hasError('hobbies')}
                    >
                      {item.label}
                    </Checkbox>
                  ))}
                </Stack>
              </FormItem>
              <FormItem label="Privacy" required error={getError('privacy')}>
                <Select
                  {...native(field('privacy'))}
                  isInvalid={hasError('privacy')}
                >
                  {SELECT_ITEMS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </Select>
              </FormItem>
              <Button
                isLoading={isSubmitting}
                loadingText="Submitting"
                colorScheme="green"
                type="submit"
              >
                Submit
              </Button>
            </Form>
          </Box>
          <Box flex="1">
            <Heading fontSize="3xl">Form State Preview</Heading>
            <Spacer h="6" />
            <FormStatePreview />
          </Box>
        </Flex>
      </Container>
    </FormProvider>
  );
};

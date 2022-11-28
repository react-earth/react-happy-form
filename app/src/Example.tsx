import React from 'react';
import { native, useForm, FormErrors, FormProvider } from 'react-happy-form';
import {
  Box,
  Container,
  Flex,
  Heading,
  Spacer,
  FormControl,
  Input,
  FormLabel,
  RadioGroup,
  Stack,
  Radio,
  CheckboxGroup,
  Checkbox,
  Select,
  Button,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';
import { FormStatePreview } from './FormStatePreview';

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
  });
  const {
    field,
    isSubmitting,
    handleSubmit,
    hasError,
    getError,
    fieldRefs,
    setFieldRef,
  } = form;
  const toast = useToast();

  console.log(fieldRefs);

  const onSubmit = async (values: ExampleFormValues) => {
    // wait 1s for submitting
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(undefined);
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack gap="4">
                <FormControl isRequired isInvalid={hasError('name')}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    {...native(field('name'))}
                    placeholder="Please enter your name"
                    required={false}
                  />
                  <FormErrorMessage>{getError('name')}</FormErrorMessage>
                </FormControl>
                <FormControl>
                  <FormLabel>Sex</FormLabel>
                  <RadioGroup {...field('sex', { withoutRef: true })}>
                    <Stack direction="row" gap="2">
                      <Radio value="male">Male</Radio>
                      <Radio value="female">Female</Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
                <FormControl isRequired isInvalid={hasError('hobbies')}>
                  <FormLabel>Hobbies</FormLabel>
                  <CheckboxGroup {...field('hobbies', { withoutRef: true })}>
                    <Stack direction="row" gap="2">
                      <Checkbox
                        value="swimming"
                        required={false}
                        ref={(ref) => setFieldRef('hobbies', ref)}
                      >
                        Swimming
                      </Checkbox>
                      <Checkbox value="running" required={false}>
                        Running
                      </Checkbox>
                      <Checkbox value="basketball" required={false}>
                        Basketball
                      </Checkbox>
                    </Stack>
                  </CheckboxGroup>
                  <FormErrorMessage>{getError('hobbies')}</FormErrorMessage>
                </FormControl>
                <FormControl>
                  <FormLabel>Privacy</FormLabel>
                  <Select {...native(field('privacy'))}>
                    <option value="public">Everyone can view</option>
                    <option value="friends">Your friends can view</option>
                    <option value="private">Only your can view</option>
                  </Select>
                </FormControl>
                <Button
                  isLoading={isSubmitting}
                  loadingText="Submitting"
                  colorScheme="green"
                  type="submit"
                >
                  Submit
                </Button>
              </Stack>
            </form>
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

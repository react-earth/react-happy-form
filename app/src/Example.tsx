import React from 'react';
import { native, useForm, FormErrors, FormProvider } from 'react-happy-form';
import {
  Box,
  Container,
  Flex,
  Heading,
  Spacer,
  Input,
  Radio,
  Checkbox,
  Select,
  Button,
  useToast,
  FormControl,
  FormLabel,
  FormErrorMessage,
  RadioGroup,
  HStack,
  VStack,
  CheckboxGroup,
} from '@chakra-ui/react';
import { FormStatePreview } from './FormStatePreview';

export type ExampleFormValues = {
  name?: string;
  gender?: string;
  hobbies?: string[];
  privacy?: string;
};

export const Example = () => {
  const form = useForm<ExampleFormValues>({
    onValidate: (values) => {
      const errors: FormErrors<ExampleFormValues> = new Map();
      if (!values.name) {
        errors.set('name', 'Name is required');
      }
      if (!values.gender) {
        errors.set('gender', 'Gender is required');
      }
      if (!values.hobbies || values.hobbies.length === 0) {
        errors.set('hobbies', 'Hobbies is required');
      }
      if (!values.privacy) {
        errors.set('privacy', 'Privacy is required');
      }
      return errors;
    },
    onSubmit: async (values: ExampleFormValues) => {
      // wait 1s for submitting
      await new Promise((resolve) => {
        setTimeout(() => {
          toast({
            title: 'Form submit successfully!',
            position: 'top',
            status: 'success',
          });
          resolve(values);
        }, 1000);
      });
    },
    isValidateOnTouched: true,
    isFocusOnValidateFailed: true,
  });
  const { field, submit, hasError, getError, isSubmitting } = form;
  const toast = useToast();

  return (
    <FormProvider value={form}>
      <Container maxW="container.xl">
        <Box p={12}>
          <Flex gap="12">
            <Box flex="1">
              <Heading fontSize="3xl">React Happy Form</Heading>
              <Spacer h="6" />
              <form onSubmit={submit} noValidate>
                <VStack spacing={4}>
                  <FormControl isRequired isInvalid={hasError('name')}>
                    <FormLabel>Name</FormLabel>
                    <Input
                      {...native(field('name'))}
                      placeholder="Please enter your name"
                      isInvalid={hasError('name')}
                    />
                    <FormErrorMessage>{getError('name')}</FormErrorMessage>
                  </FormControl>
                  <FormControl isRequired isInvalid={hasError('gender')}>
                    <FormLabel>Gender</FormLabel>
                    <RadioGroup {...field('gender', { ref: false })}>
                      <HStack spacing={4}>
                        <Radio value="male">Male</Radio>
                        <Radio value="female">Female</Radio>
                      </HStack>
                    </RadioGroup>
                    <FormErrorMessage>{getError('gender')}</FormErrorMessage>
                  </FormControl>
                  <FormControl isRequired isInvalid={hasError('hobbies')}>
                    <FormLabel>Hobbies</FormLabel>
                    <CheckboxGroup {...field('hobbies', { ref: false })}>
                      <HStack spacing={4}>
                        <Checkbox value="swimming">Swimming</Checkbox>
                        <Checkbox value="running">Running</Checkbox>
                      </HStack>
                    </CheckboxGroup>
                    <FormErrorMessage>{getError('hobbies')}</FormErrorMessage>
                  </FormControl>
                  <FormControl isRequired isInvalid={hasError('privacy')}>
                    <FormLabel>Privacy</FormLabel>
                    <Select
                      {...native(field('privacy'))}
                      placeholder="Please select privacy"
                    >
                      <option value="public">Everyone can view</option>
                      <option value="friends">Your friends can view</option>
                      <option value="private">Only your can view</option>
                    </Select>
                    <FormErrorMessage>{getError('privacy')}</FormErrorMessage>
                  </FormControl>
                  <Button
                    isLoading={isSubmitting}
                    loadingText="Submitting"
                    colorScheme="green"
                    type="submit"
                    width="full"
                  >
                    Submit
                  </Button>
                </VStack>
              </form>
            </Box>
            <Box flex="1">
              <Heading fontSize="3xl">Form State Preview</Heading>
              <Spacer h="6" />
              <FormStatePreview />
            </Box>
          </Flex>
        </Box>
      </Container>
    </FormProvider>
  );
};

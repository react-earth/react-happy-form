import { Box, Flex, FormErrorMessage } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

type FormItemProps = {
  label: string;
  required?: boolean;
  error?: string;
  children?: ReactNode;
};

export const FormItem = (props: FormItemProps) => {
  const { label, required, error, children } = props;

  return (
    <Box>
      <Box as="label" display="block" fontWeight="medium" mb="2">
        {label}
        {required && (
          <Box as="span" ml="1" color="red.500">
            *
          </Box>
        )}
      </Box>
      <Box>{children}</Box>
      {error && (
        <Box mt="2" fontSize="sm" color="red.500">
          {error}
        </Box>
      )}
    </Box>
  );
};

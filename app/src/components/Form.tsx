import { Stack } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

type FormProps = {
  onSubmit: () => void;
  children?: ReactNode;
};

export const Form = (props: FormProps) => {
  const { onSubmit, children } = props;

  return (
    <form onSubmit={onSubmit}>
      <Stack gap="4">{children}</Stack>
    </form>
  );
};

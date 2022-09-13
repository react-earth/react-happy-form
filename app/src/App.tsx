import styled from '@emotion/styled';
import { Box, Tab, Tabs } from '@mui/material';
import React from 'react';
import { useForm } from 'react-happy-form';
import { mui } from './fieldWrapper';
import { MUIForm } from './MUIForm';
import { NativeForm } from './NativeForm';
import { NestedForm } from './NestedForm';

type FormValues = {
  tab?: 'native' | 'nested' | 'mui';
};

export const App = () => {
  const { field, values } = useForm<FormValues>({
    defaultValues: {
      tab: 'native',
    },
  });

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs {...mui(field('tab'))}>
          <Tab value="native" label="Native Form" />
          <Tab value="nested" label="Nested Form" />
          <Tab value="mui" label="MUI Form" />
        </Tabs>
      </Box>
      <TabBody>
        {values?.tab === 'native' && <NativeForm />}
        {values?.tab === 'nested' && <NestedForm />}
        {values?.tab === 'mui' && <MUIForm />}
      </TabBody>
    </>
  );
};

const TabBody = styled.div`
  padding: 24px 48px;
`;

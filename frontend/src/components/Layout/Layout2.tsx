import * as React from 'react';
import NavBar from '../NavBar/NavBar';
import { Box, Grid, useMantineTheme } from '@mantine/core';
import Chats from '../Chats/Chats';

export interface ILayoutProps {
}

export default function Layout (props: ILayoutProps) {
    const theme = useMantineTheme();
  return (
    <Grid p={theme.spacing.xs}>
         <Grid.Col span={{ base: 12, md: 6, lg: 0.5 }}>
         <NavBar/>
         </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6, lg: 3.5 }}>
        <Chats/>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6, lg: "auto" }}>3</Grid.Col>
     
    </Grid>
  );
}

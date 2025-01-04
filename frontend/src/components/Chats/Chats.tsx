import { Box, useMantineTheme, Text, Title, Flex, ThemeIcon } from '@mantine/core';
import * as React from 'react';
import IconMessageAdd from '../../assets/icons/addMessage.svg?react'
import IconMenu from '../../assets/icons/menu.svg?react'
import ChatCard from '../Cards/ChatCard/ChatCard';

export interface IChatsProps {
}

export default function Chats (props: IChatsProps) {
    const theme = useMantineTheme();
  return (
    <Box  >
      <Flex justify={'space-between'} p={theme.spacing.xs}>
        <Title order={2}>Chats</Title>
        <Flex  justify={'space-between'} >
            <ThemeIcon>

            <IconMessageAdd/>
            </ThemeIcon>
            <ThemeIcon>

            <IconMenu/>
            </ThemeIcon>
        </Flex>
      
      </Flex>
      <Flex direction={'column'} p={theme.spacing.xs}>
            <ChatCard/>
        </Flex>
    </Box>
  );
}

import { Avatar, Flex, Title } from '@mantine/core';
import * as React from 'react';

export interface IChatCardProps {
}

export default function ChatCard (props: IChatCardProps) {
  return (
    <Flex>
      <Avatar />
      <Flex direction={'column'}>
        <Title order={3}>UserName</Title>
      </Flex>
    </Flex>
  );
}

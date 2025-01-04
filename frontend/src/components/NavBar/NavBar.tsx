// import { IconMessage } from '@tabler/icons-react';
import { Group, Stack, ThemeIcon } from '@mantine/core';
import React from 'react';
import IconMessage from '../../assets/icons/message.svg?react'
import IconStatus from '../../assets/icons/status.svg?react'
import IconChannels from '../../assets/icons/channels.svg?react'
import IconCommunity from '../../assets/icons/community.svg?react'
import IconSetting from '../../assets/icons/setting.svg?react'
import IconMeta from '../../assets/icons/meta.png'

export interface IHeaderProps {
}

export default function NavBar (props: IHeaderProps) {
  return (
    <Stack>
    <Stack>
      <ThemeIcon>

      <IconMessage/>
      </ThemeIcon>
      <ThemeIcon>

      <IconStatus/>
      </ThemeIcon>
      <ThemeIcon>

      <IconChannels/>
      </ThemeIcon>
      <ThemeIcon>

      <IconCommunity/>
      </ThemeIcon>
      {/* <ThemeIcon /> */}
    </Stack>
    <Stack>
      <ThemeIcon>

      <IconSetting/>
      </ThemeIcon>
    </Stack>
    </Stack>
  );
}

import { PageHeader } from '@/components';
import {
  Container,
  Stack
} from '@mantine/core';

import { UserSettingDetailForm } from '@/components/UserSettingDetailForm';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'User Setting | ez2start',
}

function UserSetting() {
  return (
    <Container fluid>
      <Stack gap="lg">
        <PageHeader title="User Setting" />
        <UserSettingDetailForm p="md" shadow="md" radius="md" h="100%" />
      </Stack>
    </Container>
  );
}

export default UserSetting;

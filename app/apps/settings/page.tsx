import { PageHeader } from '@/components';
import { SettingContainer } from '@/containers/apps/settings/Settings.container';
import {
  Container,
} from '@mantine/core';

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Setting | ez2start',
}

function SettingPage() {
  return (
    <Container fluid>
      <PageHeader title="Setting" />
      <SettingContainer />
    </Container>
  );
};

export default SettingPage;

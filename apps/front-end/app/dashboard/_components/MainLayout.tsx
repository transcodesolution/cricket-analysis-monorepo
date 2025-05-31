'use client';
import { Sidebar } from '@/libs/layouts/sidebar';
import {
  AppShell,
  Burger,
  Flex,
  Group,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { ProfilePopOver } from './ProfilePopOver';

interface IMainLayout {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: IMainLayout) => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      styles={{
        header: { borderColor: 'var(--mantine-color-gray-5)' },
        navbar: { borderColor: 'var(--mantine-color-gray-5)' },
      }}
      header={{ height: 60 }}
      navbar={{
        width: 240,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
      bg={'var(--mantine-color-gray-1)'}
    >
      {/* Header */}
      <AppShell.Header bg='var(--mantine-color-gray-1)'>
        <Flex justify="space-between" align="center" h="100%" px="lg">
          <Group onClick={() => redirect('/dashboard')} styles={{ root: { cursor: 'pointer' } }}>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Image
              src="/assets/images/logo.svg"
              alt="CrickAI Logo"
              height={32}
              width={32}
            />
            <Text fw={600} size="24">
              CrickAI
            </Text>
          </Group>
          <ProfilePopOver />
        </Flex>
      </AppShell.Header>

      {/* Sidebar */}
      <AppShell.Navbar p="xs" bg='var(--mantine-color-gray-1)'>
        <Sidebar />
      </AppShell.Navbar>

      {/* Main Content */}
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

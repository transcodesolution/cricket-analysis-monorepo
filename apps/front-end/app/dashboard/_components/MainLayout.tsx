'use client';
import { Sidebar } from '@/libs/layouts/sidebar';
import {
  ActionIcon,
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
import { IconChevronCompactLeft, IconChevronCompactRight } from '@tabler/icons-react';

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
        collapsed: { desktop: !opened, mobile: !opened },
      }}
      padding="md"
      bg={'var(--mantine-color-gray-1)'}
    >
      {/* Header */}
      <AppShell.Header bg='var(--mantine-color-gray-1)'>
        <Flex justify="space-between" align="center" h="100%" px="lg">
          <Group >
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Group onClick={() => redirect('/dashboard')} styles={{ root: { cursor: 'pointer' } }}>
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
          </Group>
          <ProfilePopOver />
        </Flex>
      </AppShell.Header>

      {/* Sidebar */}
      <AppShell.Navbar p="xs" bg='var(--mantine-color-gray-1)'>
        <ActionIcon
          variant="default"
          bg='var(--mantine-color-primary-1)'
          c={'var(--mantine-color-primary-7)'}
          size="md"
          onClick={toggle}
          pos='absolute'
          visibleFrom='sm'
          styles={{ root: { right: '-28px', bottom: '4rem', borderRadius: "0 0.3rem 0 0" } }}
        >
          {!opened ? <IconChevronCompactRight size={20} /> : <IconChevronCompactLeft size={20} />}
        </ActionIcon>

        <Sidebar toggle={toggle} />
      </AppShell.Navbar>

      {/* Main Content */}
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
'use client'
import React from 'react';
import { RoleFilter } from './_components/RoleFilter';
import { RoleList } from './_components/RoleList';
import { Button, Paper, Stack, Title } from '@mantine/core';

import { usePermissions } from '@/libs/hooks/usePermissions';
import Link from 'next/link';
import { IconPlus } from '@tabler/icons-react';
import classes from './roles.module.scss'

export default function Page() {
  const permission = usePermissions()

  if (!permission?.hasRoleRead) return null;

  return (
    <Paper withBorder radius="lg" p="md">
      <Stack gap='sm'>
        <Title order={4} >Roles</Title>
        <Button className={classes.animatedButton} size='md' color="var(--mantine-color-customBlue-5)" component={Link} href='/dashboard/roles/create' w='fit-content' rightSection={<IconPlus size={16} />}>Create</Button>
        <RoleFilter />
        <RoleList />
      </Stack>
    </Paper>
  )
}
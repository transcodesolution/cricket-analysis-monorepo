'use client'
import { usePermissions } from '@/libs/hooks/usePermissions';
import { useCreateRole } from '@/libs/react-query-hooks/src';
import { IUserRole } from '@cricket-analysis-monorepo/interfaces';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import React from 'react'
import { RoleForm } from '../_components/RoleForm';
import { useRouter } from 'next/navigation';
import { Stack } from '@mantine/core';
import BackToOverview from '@/libs/custom/back-to-overview';

export default function Page() {
  const permission = usePermissions();
  const router = useRouter()
  const { mutate: createRole, isPending: isCreating } = useCreateRole();

  const handleCreateRole = (role: IUserRole) => {
    if (!permission?.hasRoleCreate) {
      showNotification({
        title: "Create Failed",
        message: "User do not have permission to create role",
        color: "red",
        icon: <IconX size={16} />,
      });
      return;
    }
    const { name, permissions } = role;
    createRole(
      {
        name,
        permissions
      },
      {
        onSuccess: () => {
          showNotification({
            title: "Success",
            message: "Role Created Successfully",
            color: "green",
            icon: <IconCheck size={16} />,
          });
          router.push(`/dashboard/roles/`);
        },
        onError: (error) => {
          showNotification({
            title: "Create Failed",
            message: error.message,
            color: "red",
            icon: <IconX size={16} />,
          });
        },
      }
    );
  };
  return (
    <Stack pos='relative'>
      <BackToOverview title="Roles" backUrl='/dashboard/roles' />
      <RoleForm role={null} onSubmit={handleCreateRole} isSubmitting={isCreating} />
    </Stack>
  )
}

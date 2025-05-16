'use client'
import React from 'react';
import { Stack } from '@mantine/core';
import BackToOverview from '@/libs/custom/back-to-overview';
import { useGetRoleById, useUpdateRole } from '@/libs/react-query-hooks/src';
import { useParams } from 'next/navigation';
import { RoleForm } from '../_components/RoleForm';
import { IUserRole } from '@cricket-analysis-monorepo/interfaces';
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';

export default function Page() {
  const { roleId } = useParams<{ roleId: string }>();
  const { data: getRoleByIdResponse, isLoading } = useGetRoleById({ roleId });
  const { mutate: updateRole } = useUpdateRole();


  const handleUpdateRole = (role: IUserRole) => {
    updateRole({
      ...role
    }, {
      onError: (error) => {
        showNotification({
          title: "Update Failed",
          message: error.message,
          color: "red",
          icon: <IconX size={16} />,
        });
      },
    });
  }
  const role = getRoleByIdResponse?.data;

  if (isLoading) return 'Loading';
  if (!role) return 'No Data';

  return (
    <Stack pos='relative'>
      <BackToOverview title="Back" backUrl='/dashboard/roles' />
      <RoleForm role={role} onSubmit={handleUpdateRole} />
    </Stack>
  )
}
"use client";
import React from 'react'
import { useGetUserById, useUpdateUser } from '@/libs/react-query-hooks/src';
import { UserForm } from '../_components/UserForm';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { LoadingOverlay, Paper } from '@mantine/core';
import { useParams } from 'next/navigation';
import { IUser } from '@cricket-analysis-monorepo/interfaces';
import BackToOverview from '@/libs/custom/back-to-overview';

export default function Page() {
  const { userId } = useParams<{ userId: string }>();
  const { data: getUserByIdResponse, isLoading } = useGetUserById({ id: userId });
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const user = getUserByIdResponse?.data?.user;

  const handleUpdateUser = (user: Partial<IUser>) => {
    updateUser(
      { _id: userId, ...user },
      {
        onSuccess: () => {
          showNotification({
            title: "Success",
            message: "User Updated Successfully",
            color: "green",
            icon: <IconCheck size={16} />,
          });
        },
        onError: (error) => {
          showNotification({
            title: "Error",
            message: error instanceof Error ? error.message : "An unexpected error occurred.",
            color: "red",
            icon: <IconCheck size={16} />,
          });
        },
      }
    );
  };
  return (
    <Paper withBorder radius="lg" p="md">
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
      <BackToOverview title="Users" backUrl='/dashboard/users' />
      <UserForm onSubmit={handleUpdateUser} user={user} isSubmitting={isUpdating} />
    </Paper>
  )
} 
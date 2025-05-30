"use client";
import { UserForm } from "../_components/UserForm";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useCreateUser } from "@/libs/react-query-hooks/src";
import { IUser } from "@cricket-analysis-monorepo/interfaces";
import { Stack } from "@mantine/core";
import BackToOverview from "@/libs/custom/back-to-overview";
import { useRouter } from "next/navigation";

export default function Page() {
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const router = useRouter()

  const handleCreateUser = (user: Partial<IUser>) => {
    createUser(
      {
        ...user
      },
      {
        onSuccess: () => {
          showNotification({
            title: "Success",
            message: "User Created Successfully",
            color: "green",
            icon: <IconCheck size={16} />,
          });
          router.push(`/dashboard/users/`);
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
      <BackToOverview title="Users" backUrl='/dashboard/users' />
      <UserForm onSubmit={handleCreateUser} isSubmitting={isCreating} />
    </Stack>
  )
} 
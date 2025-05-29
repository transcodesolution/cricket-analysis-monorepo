"use client";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { setUser, useUserStore } from "../../../../libs/store/src/lib/user";
import { useUpdateUserProfile } from "@/libs/react-query-hooks/src";
import { IconCheck, IconX } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import { useEffect } from "react";

export const ProfileDetail = () => {
  const { user } = useUserStore();
  const { mutate: updateUserProfile, isPending: isUpdating } = useUpdateUserProfile();

  const form = useForm({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    },
  });

  const handleSave = () => {
    updateUserProfile(form.values, {
      onSuccess: () => {
        setUser({ ...user, ...form.values });
        showNotification({
          title: "Success",
          message: "User Updated Successfully",
          color: "green",
          icon: <IconCheck size={16} />,
        });
      },
      onError: (error) => {
        showNotification({
          title: "Update Failed",
          message: error instanceof Error ? error.message : "An unexpected error occurred.",
          color: "red",
          icon: <IconX size={16} />,
        });
      },
    });
  };

  useEffect(() => {
    form.setValues({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (!user) return <Text>No user data available</Text>;

  return (
    <Paper withBorder radius="lg" p="lg">
      <Stack gap="xl">
        <Title order={4}>My Profile</Title>
        <Flex direction="column" align="center" gap="sm">
          <Avatar
            src={user.profileImage || undefined}
            alt="Profile Image"
            radius="lg"
            size={100}
            color="primary"
          />
        </Flex>
        <Box w="100%" component="form" onSubmit={form.onSubmit(handleSave)}>
          <TextInput
            label="First Name"
            mb="md"
            disabled={isUpdating}
            {...form.getInputProps("firstName")}
          />
          <TextInput
            label="Last Name"
            mb="md"
            disabled={isUpdating}
            {...form.getInputProps("lastName")}
          />
          <TextInput
            label="Email"
            value={user.email || ""}
            mb="md"
            disabled
            styles={{ input: { color: 'black' } }}
          />
          <Flex justify="flex-end">
            <Button type="submit" loading={isUpdating} size="md" color="primary" w="fit-content">
              Save
            </Button>
          </Flex>
        </Box>
      </Stack>
    </Paper>
  );
};

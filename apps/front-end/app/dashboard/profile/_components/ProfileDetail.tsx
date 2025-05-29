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
import { setUser, useUserStore } from "../../../../libs/store/src/lib/user";
import { useUpdateUserProfile } from "@/libs/react-query-hooks/src";
import { IconCheck, IconX } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import { IUser } from "@cricket-analysis-monorepo/interfaces";

export const ProfileDetail = () => {
  const { user } = useUserStore();
  const { mutate: updateUserProfile, isPending: isUpdating } = useUpdateUserProfile();

  const handleSave = () => {
    updateUserProfile({
      firstName: user.firstName,
      lastName: user.lastName,
    },
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
            title: "Update Failed",
            message: error instanceof Error ? error.message : "An unexpected error occurred.",
            color: "red",
            icon: <IconX size={16} />,
          });
        },
      }
    );
  }

  const handleChange = (field: keyof IUser, value: string) => {
    setUser({ ...user, [field]: value });
  };

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
            color='primary'
          />
        </Flex>
        <Box w="100%">
          <TextInput
            label="First Name"
            value={user.firstName || ""}
            onChange={(e) => handleChange("firstName", e.target.value)}
            mb="md"
          />
          <TextInput
            label="Last Name"
            value={user.lastName || ""}
            onChange={(e) => handleChange("lastName", e.target.value)}
            mb="md"
          />
          <TextInput
            label="Email"
            value={user.email || ""}
            mb="md"
            disabled
          />
          <Flex justify="flex-end">
            <Button onClick={handleSave} loading={isUpdating}
              size="md"
              color="primary"
              w='fit-content'>Save</Button>
          </Flex>
        </Box>
      </Stack>
    </Paper>
  );
};

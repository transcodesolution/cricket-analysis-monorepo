"use client";
import {
  Avatar,
  Box,
  Flex,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { setUser, useUserStore } from "../../../../libs/store/src/lib/user";
import { updateUserProfile } from "@/libs/web-apis/src";
import { IUser } from "@cricket-analysis-monorepo/interfaces";
import { isEquals } from "@/libs/utils/ui-helper";

export const ProfileDetail = () => {
  const { user } = useUserStore();
  const [userDetails, setUserDetails] = useState<IUser | null>(null);

  useEffect(() => {
    setUserDetails(user ? { ...user } : null);
  }, [user]);

  const debouncedUpdateUser = useDebouncedCallback((updatedUser: IUser) => {
    if (user && !isEquals(updatedUser, user)) {
      updateUserProfile({
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
      })
        .then(() => {
          setUser(updatedUser);
        })
        .catch((error) => {
          showNotification({
            title: "Update Failed",
            message:
              error instanceof Error
                ? error.message
                : "An unexpected error occurred.",
            color: "red",
            icon: <IconX size={16} />,
          });
        });
    }
  }, 600);

  const handleChange = (field: keyof IUser, value: string) => {
    if (!userDetails) return;
    const updatedUser = { ...userDetails, [field]: value };
    setUserDetails(updatedUser);
    debouncedUpdateUser(updatedUser);
  };

  if (!userDetails) {
    return <Text>No user data available</Text>;
  }

  return (
    <Paper withBorder radius="lg" p="lg">
      <Stack gap="xl">
        <Title order={4}>My Profile</Title>
        <Flex direction="column" align="center" gap="sm">
          <Avatar
            src={userDetails.profileImage || undefined}
            alt="Profile Image"
            radius="lg"
            size={100}
            color='primary'
          />
        </Flex>
        <Box w="100%">
          <TextInput
            label="First Name"
            name="firstName"
            value={userDetails.firstName || ""}
            onChange={(e) => handleChange("firstName", e.target.value)}
            mb="md"
            required
          />
          <TextInput
            label="Last Name"
            name="lastName"
            value={userDetails.lastName || ""}
            onChange={(e) => handleChange("lastName", e.target.value)}
            mb="md"
            required
          />
          <TextInput
            label="Email"
            name="email"
            value={userDetails.email || ""}
            mb="md"
            disabled
          />
        </Box>
      </Stack>
    </Paper>
  );
};

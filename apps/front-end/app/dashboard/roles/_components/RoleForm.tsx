'use client';

import {
  Title,
  TextInput,
  Stack,
  Group,
  Paper,
  Flex,
  Button,
} from "@mantine/core";
import { IconUsers } from "@tabler/icons-react";
import { useForm } from "@mantine/form";

import { RolePermissionsList } from "./RolePermissionsList";
import { IUserRole } from "@cricket-analysis-monorepo/interfaces";
import { UserRoleType } from "@cricket-analysis-monorepo/constants";
import { useEffect } from "react";
import classes from '../roles.module.scss'

interface IRoleForm {
  role: IUserRole | null;
  isSubmitting?: boolean;
  onSubmit?: (role: IUserRole) => void;
}

export const RoleForm = ({
  role,
  onSubmit,
  isSubmitting = false,
}: IRoleForm) => {
  const form = useForm<IUserRole>({
    initialValues: {
      _id: role?._id ?? '',
      name: role?.name ?? '',
      type: role?.type ?? UserRoleType.custom,
      permissions: role?.permissions ?? [],
    },

    validate: {
      name: (value) => (value.trim().length === 0 ? "Role name is required" : null),
    }
  });

  const handleSubmit = () => {
    if (!form.validate().hasErrors) {
      onSubmit?.(form.values);
    }
  };

  useEffect(() => {
    if (role) {
      form.setValues(role)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role])


  return (
    <Stack gap="lg">
      <Paper shadow="sm" radius="md" withBorder p="lg">
        <Stack gap="md">
          <Flex align="center" gap="md">
            <Title order={2}>Role</Title>
          </Flex>
          <Group grow>
            <TextInput
              label="Role Name"
              placeholder="Enter role name"
              leftSection={<IconUsers size={18} />}
              {...form.getInputProps("name")}
              required
            />
          </Group>
        </Stack>
      </Paper>

      <RolePermissionsList
        selectedPermissions={form.values.permissions}
        onPermissionsChange={(permissions) => form.setFieldValue("permissions", permissions)}
      />

      <Button
        onClick={handleSubmit}
        loading={isSubmitting}
        size="md"
        w='fit-content'
        ml='auto'
        color="var(--mantine-color-customBlue-5)"
        className={classes.animatedButton}
      >
        {role ? "Update" : "Create"}
      </Button>
    </Stack>
  );
};
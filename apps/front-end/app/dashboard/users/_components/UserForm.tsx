import { useGetRoles } from "@/libs/react-query-hooks/src";
import { IUser } from "@cricket-analysis-monorepo/interfaces";
import { Button, Flex, Paper, PasswordInput, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import classes from '../users.module.scss'

interface IUserFormProps {
  user?: IUser;
  isSubmitting?: boolean;
  onSubmit: (values: Partial<IUser>) => void;
}

type EditableUserFields = Pick<IUser, "firstName" | "lastName" | "email" | "password" | "roleId">;

export const UserForm = ({ onSubmit, isSubmitting, user }: IUserFormProps) => {
  const { data: rolesResponse } = useGetRoles({ page: 1, limit: 100, search: '' });
  const roles = rolesResponse?.data?.roles || [];

  const form = useForm<EditableUserFields>({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      password: "",
      roleId: user?.roleId || "",
    },
    validate: {
      firstName: (value) => (value.trim() ? null : "First name is required"),
      lastName: (value) => (value.trim() ? null : "Last name is required"),
      email: (value) => (value.trim() ? (/^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email format") : "Email is required"),
      password: (value) => (!user && !value.trim() ? "Password is required" : null),
    },
  });

  useEffect(() => {
    if (user) {
      form.setValues(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSubmit = () => {
    if (!form.validate().hasErrors) {
      onSubmit?.(form.values);
    }
  };

  return (
    <Stack gap="lg">
      <Paper shadow="sm" radius="md" withBorder p="lg">
        <Flex direction="column" gap="md">
          <TextInput label="First Name" placeholder="Enter First Name" {...form.getInputProps("firstName")} />
          <TextInput label="Last Name" placeholder="Enter Last Name" {...form.getInputProps("lastName")} />
          <TextInput label="Email" required placeholder="Enter Email" {...form.getInputProps("email")} />
          <PasswordInput label="Password" required placeholder="Enter Password" {...form.getInputProps("password")} />
          <Select
            label="Role"
            placeholder="Select Role"
            required
            data={roles.map((role) => ({
              value: role._id,
              label: role.name || "Unnamed Role",
            }))}
            value={form.values.roleId}
            onChange={(value) => {
              form.setFieldValue("roleId", value || "");
            }}
          />
        </Flex>
      </Paper>
      <Button onClick={handleSubmit} loading={isSubmitting}
        size="md"
        color="var(--mantine-color-customBlue-5)"
        w='fit-content'
        ml='auto'
        className={classes.animatedButton}
      >
        {user ? "Save" : "Create"}
      </Button>
    </Stack>
  );
};

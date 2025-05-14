import { useGetRoles } from "@/libs/react-query-hooks/src";
import { IUser } from "@cricket-analysis-monorepo/interfaces";
import { Box, Button, Flex, PasswordInput, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

interface IUserFormProps {
  onSubmit: (values: Partial<IUser>) => void;
  isLoading?: boolean;
  user?: IUser;
}

type EditableUserFields = Pick<IUser, "firstName" | "lastName" | "email" | "password" | "roleId">;

export const UserForm = ({ onSubmit, isLoading, user }: IUserFormProps) => {
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
      form.setValues({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        password: "",
        roleId: user.roleId || "",
      });
    }
  }, [user]);

  const handleSubmit = () => {
    if (!form.validate().hasErrors) {
      onSubmit?.(form.values);
    }
  };

  return (
    <Flex direction="column" align="center" gap="md">
      <Box w="100%">
        <TextInput label="First Name" placeholder="Enter First Name" mb="md" {...form.getInputProps("firstName")} />
        <TextInput label="Last Name" placeholder="Enter Last Name" mb="md" {...form.getInputProps("lastName")} />
        <TextInput label="Email" placeholder="Enter Email" mb="md" {...form.getInputProps("email")} />
        <PasswordInput label="Password" placeholder="Enter Password" mb="md" {...form.getInputProps("password")} />
        <Select
          label="Role"
          placeholder="Select Role"
          data={roles.map((role) => ({
            value: role._id,
            label: role.name || "Unnamed Role",
          }))}
          value={form.values.roleId}
          onChange={(value) => {
            form.setFieldValue("roleId", value || "");
          }}
        />

        <Flex mt="md" justify="flex-end" gap="sm">
          <Button onClick={handleSubmit} loading={isLoading}
            size="md"
            color="var(--mantine-color-customBlue-5)">
            {user ? "Save" : "Create"}
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

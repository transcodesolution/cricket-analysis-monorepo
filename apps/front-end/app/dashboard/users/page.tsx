'use client'
import { Title, Button, Stack, Paper } from '@mantine/core'
import React from 'react'
import { UserFilter } from './_components/UserFilter'
import { UserList } from './_components/UserList'
import { useRouter } from 'next/navigation'
import { IconPlus } from '@tabler/icons-react'

export default function Page() {
  const router = useRouter()

  const handleCreateUser = () => {
    router.push(`/dashboard/users/create`)
  };

  return (
    <Paper withBorder radius="lg" p="md">
      <Title order={4} fw={500} mb="md" c="var(--mantine-color-gray-8)">
        Users
      </Title>
      <Button rightSection={<IconPlus size={22} />}
        size="md"
        color="var(--mantine-color-customBlue-5)" onClick={handleCreateUser} >Create</Button>
      {/* <UserFilter /> */}
      <UserList />
    </Paper>
  )
}
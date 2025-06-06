'use client'
import { Title, Button, Paper, Stack } from '@mantine/core'
import React from 'react'
import { UserFilter } from './_components/UserFilter'
import { UserList } from './_components/UserList'
import { IconPlus } from '@tabler/icons-react'
import Link from 'next/link'
import classes from './users.module.scss'

export default function Page() {
  return (
    <Paper withBorder radius="lg" p="md">
      <Stack gap='sm'>
        <Title order={4}>Users</Title>
        <Button className={classes.animatedButton} size='md' color="var(--mantine-color-customBlue-5)" rightSection={<IconPlus size={16} />} href='/dashboard/users/create' component={Link} w='fit-content'>Create</Button>
        <UserFilter />
        <UserList />
      </Stack>
    </Paper>
  )
}
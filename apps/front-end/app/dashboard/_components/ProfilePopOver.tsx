import { logout } from '@/libs/web-apis/src'
import { Avatar, Menu } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconLogout, IconUser } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import React from 'react'

export const ProfilePopOver = () => {
  const router = useRouter();

  const handleLogout = () => {
    logout().then((response) => {
      router.push('/auth/signin');
      showNotification({
        message: response.message,
        color: 'green',
      });
    })
  }

  const handleProfileClick = () => {
    router.push('/dashboard/profile');
  }

  return (
    <Menu shadow="md" width={200} position='bottom-end'>
      <Menu.Target>
        <Avatar
          src={null}
          alt="User"
          radius="xl"
          size='md'
          color='primary'
        />
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item leftSection={<IconUser size={14} />} onClick={handleProfileClick}>
          Profile
        </Menu.Item>
        <Menu.Item
          color="red"
          leftSection={<IconLogout size={14} />}
          onClick={handleLogout}
        >
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}

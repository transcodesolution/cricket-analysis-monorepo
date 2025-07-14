import React from 'react';
import {
  IconUpload,
  IconReportAnalytics,
  IconUsers,
  IconBrandRedhat,
  IconBrandGithubCopilot,
} from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Box, Flex, ThemeIcon } from '@mantine/core';
import { NavbarLinksGroup } from './components/NavbarLinksGroup';
import classes from './sidebar.module.scss';
import Link from 'next/link';
import { useUserStore } from '@/libs/store/src';
import { Permission } from '@cricket-analysis-monorepo/constants';
import { useMediaQuery } from '@mantine/hooks';

const linksData = [
  {
    label: 'Upload',
    icon: IconUpload,
    link: '/dashboard/upload',
    permissions: [Permission.UPLOAD_FILES]
  },
  {
    label: 'Reports',
    icon: IconReportAnalytics,
    link: '/dashboard/reports',
    permissions: [Permission.VIEW_REPORTS]
  },
  {
    label: 'AI Analysis',
    icon: IconBrandGithubCopilot,
    link: '/dashboard/ai-analysis',
    permissions: [Permission.AI_ANALYSIS]
  },
  {
    label: 'Roles',
    icon: IconBrandRedhat,
    link: '/dashboard/roles',
    permissions: [Permission.VIEW_ROLE]
  },
  {
    label: 'Users',
    icon: IconUsers,
    link: '/dashboard/users',
    permissions: [Permission.VIEW_USER]
  },
];

export const Sidebar = ({ toggle }: {toggle: () => void}) => {
  const pathname = usePathname();
  const { user } = useUserStore();
  const userPermissions = user?.role?.permissions || [];
  const filteredData = linksData.filter((item) => item.permissions.every((permission) => userPermissions.includes(permission)));
  const isMobile = useMediaQuery('(max-width: 48em)'); 

  return (
    <Flex direction="column" h="100%" gap='xs'>
      {filteredData.map((item) =>
        item.link ? (
          <Link
            href={item.link}
            key={item.label}
            className={clsx(classes.sidebarLink, {
              [classes.active]: pathname.includes(item.link),
            })}
            onClick={() => {
              if (isMobile) toggle();
            }}
          >
            <Flex align='center' py={7} px="xs">
              <ThemeIcon variant='transparent' size={36}>
                <item.icon size={22} />
              </ThemeIcon>
              <Box ml="md" className={classes.linkText}>{item.label}</Box>
            </Flex>
          </Link>
        ) : (
          <NavbarLinksGroup {...item} key={item.label} />
        )
      )}
    </Flex>
  );
};

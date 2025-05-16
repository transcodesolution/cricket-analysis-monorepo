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

const linksData = [
  {
    label: 'Upload',
    icon: IconUpload,
    link: '/dashboard/upload',
  },
  {
    label: 'Reports',
    icon: IconReportAnalytics,
    link: '/dashboard/reports',
  },
  {
    label: 'AI Analysis',
    icon: IconBrandGithubCopilot,
    link: '/dashboard/ai-analysis',
  },
  {
    label: 'Roles',
    icon: IconBrandRedhat,
    link: '/dashboard/roles',
  },
  {
    label: 'Users',
    icon: IconUsers,
    link: '/dashboard/users',
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <Flex direction="column" h="100%" gap='xs'>
      {linksData.map((item) =>
        item.link ? (
          <Link
            href={item.link}
            key={item.label}
            className={clsx(classes.sidebarLink, {
              [classes.active]: pathname === item.link,
            })}
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

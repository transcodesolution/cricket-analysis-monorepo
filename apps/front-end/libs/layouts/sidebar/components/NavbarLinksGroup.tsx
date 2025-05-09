import React from 'react';
import { ForwardRefExoticComponent, RefAttributes, useState } from 'react';
import { Icon, IconChevronRight, IconProps } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import classes from '../sidebar.module.scss';
import { Box, Collapse, Group, ThemeIcon, UnstyledButton } from '@mantine/core';
import Link from 'next/link';

interface ILinksGroup {
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
}

export const NavbarLinksGroup = ({
  icon: Icon,
  label,
  initiallyOpened,
  links = [],
}: ILinksGroup) => {
  const [opened, setOpened] = useState(initiallyOpened || false);
  const pathname = usePathname();

  return (
    <div>
      <UnstyledButton onClick={() => setOpened(!opened)} className={classes.control} p="xs">
        <Group justify="space-between" gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant="transparent" size={36}>
              <Icon size={24} />
            </ThemeIcon>
            <Box ml="md" className={classes.linkText}>{label}</Box>
          </Box>
          <IconChevronRight
            className={classes.chevron}
            stroke={1.5}
            size={18}
            style={{
              transform: opened ? 'rotate(-90deg)' : 'none',
              transition: 'transform 0.2s ease',
            }}
          />
        </Group>
      </UnstyledButton>
      <Collapse in={opened} className={classes.collapse} >
        {links.map((linkItem) => (
          <Link
            href={linkItem.link}
            key={linkItem.label}
            className={clsx(classes.link, {
              [classes.active]: pathname === linkItem.link,
            })}
          >
            {linkItem.label}
          </Link>
        ))}
      </Collapse>
    </div>
  );
};

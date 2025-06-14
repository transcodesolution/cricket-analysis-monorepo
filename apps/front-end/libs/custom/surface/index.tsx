'use client';

import { ReactNode, forwardRef } from 'react';
import {
  Box,
  BoxProps,
  PaperProps,
  createPolymorphicComponent,
} from '@mantine/core';

type TSurfaceProps = { children: ReactNode } & BoxProps & PaperProps;

// Define the base component with forwardRef
const _Surface = forwardRef<HTMLDivElement, TSurfaceProps>(({ children, ...others }, ref) => (
  <Box component="div" {...others} ref={ref}>
    {children}
  </Box>
));

_Surface.displayName = 'Surface';

// Then create polymorphic component
const Surface = createPolymorphicComponent<'div', TSurfaceProps>(_Surface);

export default Surface;

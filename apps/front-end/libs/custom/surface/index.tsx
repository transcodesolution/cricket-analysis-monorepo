'use client';

import { ReactNode, forwardRef } from 'react';
import {
  Box,
  BoxProps,
  PaperProps,
  createPolymorphicComponent,
} from '@mantine/core';

type SurfaceProps = { children: ReactNode } & BoxProps & PaperProps;

// Define the base component with forwardRef
const _Surface = forwardRef<HTMLDivElement, SurfaceProps>(({ children, ...others }, ref) => (
  <Box component="div" {...others} ref={ref}>
    {children}
  </Box>
));

_Surface.displayName = 'Surface';

// Then create polymorphic component
const Surface = createPolymorphicComponent<'div', SurfaceProps>(_Surface);

export default Surface;

import '@mantine/core/styles.css';
import 'mantine-datatable/styles.layer.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.layer.css';
import '@mantine/dates/styles.layer.css';

import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import { theme } from '@/theme/theme';
import { MainLayout } from './_components/MainLayout';
import { ReactQueryClientProvider } from '@/libs/providers/ReactQueryClientProvider';
import { Notification } from '@/libs/custom/notification';
import './global.css'

export const metadata = {
  title: 'CrickAI - Smart Cricket Insights',
  description: 'CrickAI helps you analyze cricket performance with intelligent insights, reports, and AI-powered tools.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <ReactQueryClientProvider>
          <MantineProvider theme={theme}>
            <Notification position='bottom-right' />
            <MainLayout>{children}</MainLayout>
          </MantineProvider>
        </ReactQueryClientProvider>
      </body>
    </html >
  );
}
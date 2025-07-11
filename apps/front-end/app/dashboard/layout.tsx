import { MainLayout } from './_components/MainLayout';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AuthProvider } from '@/libs/providers/AuthProvider';
import { ModalsProvider } from '@mantine/modals';
import { SocketProvider } from '@/libs/providers/SocketProvider';

export const metadata = {
  title: 'CrickAI - Smart Cricket Insights',
  description: 'CrickAI helps you analyze cricket performance with intelligent insights, reports, and AI-powered tools.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const cookieStore = await cookies();
  const bearerToken = cookieStore.get('cricketAnalysisToken')?.value || '';
  if (!bearerToken) {
    redirect('/auth/signin')
  }

  return (
    <AuthProvider token={bearerToken}>
      <SocketProvider token={bearerToken}>
        <ModalsProvider>
          <MainLayout>{children}</MainLayout>
        </ModalsProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
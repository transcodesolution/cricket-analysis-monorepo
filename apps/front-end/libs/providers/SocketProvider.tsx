'use client';
import { useEffect } from 'react';
import { useSocketStore } from '../store/src/lib/socket';

export const SocketProvider = ({
  token,
  children,
}: {
  token: string;
  children: React.ReactNode;
}) => {
  const connectSocket = useSocketStore((s) => s.connectSocket);
  const disconnectSocket = useSocketStore((s) => s.disconnectSocket);

  useEffect(() => {
    if (token) {
      connectSocket({ token });
    }
    return () => {
      disconnectSocket();
    };
  }, [token, connectSocket, disconnectSocket]);

  return <>{children}</>;
}

import { IFileProgressData, IFileProgressResponse } from '@cricket-analysis-monorepo/interfaces';
import { notifications } from '@mantine/notifications';
import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

interface ISocketStore {
  socket: Socket | null;
  fileUploadStates: Record<string, IFileProgressData>;
  connectSocket(opts: { token: string; onProgress?: (d: IFileProgressData) => void }): void;
  disconnectSocket(): void;
  clearSession(id: string): void;
}

export const useSocketStore = create<ISocketStore>((set, get) => ({
  socket: null,
  fileUploadStates: {},

  connectSocket: ({ token, onProgress }) => {
    if (get().socket) return;

    const socket = io(`${process.env.NEXT_PUBLIC_BASE_API_URL}/event`, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    socket.on('connect', () => {
      console.info('Socket.IO connected:', socket.id);
      set({ socket });
    });

    socket.on('disconnect', (reason) => {
      console.warn('Socket.IO disconnected:', reason);
      set({ socket: null });
    });

    socket.on('file-progress-update', (response: IFileProgressResponse) => {
      const { success, message, data } = response;

      set((state) => ({
        fileUploadStates: {
          ...state.fileUploadStates,
          [data.requestUniqueId]: data,
        },
      }));
      onProgress?.(data);
      if (success) {
        notifications.show({
          message: message || `File ${data.requestUniqueId} finished`,
          color: success === true ? 'green' : 'red',
        });
      }
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (!socket) return;

    socket.off('file-progress-update');
    socket.disconnect();
    set({ socket: null });
  },

  clearSession: (id: string) =>
    set((state) => {
      const updated = { ...state.fileUploadStates };
      delete updated[id];
      return { fileUploadStates: updated };
    }),
}));

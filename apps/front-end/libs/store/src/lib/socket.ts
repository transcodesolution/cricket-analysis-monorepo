import { IFileProgressEvent } from '@/libs/types-api/src';
import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

interface ISocketStore {
  socket: Socket | null;
  fileUploadStates: Record<string, IFileProgressEvent>;
  connectSocket(opts: { token: string; onProgress?: (d: IFileProgressEvent) => void }): void;
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

    socket.on('file-progress-update', (d: IFileProgressEvent) => {
      set((state) => ({
        fileUploadStates: {
          ...state.fileUploadStates,
          [d.requestUniqueId]: d,
        },
      }));

      onProgress?.(d);
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

import { IUser } from "@cricket-analysis-monorepo/interfaces";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface IUserStore {
  user: IUser;
}

export const useUserStore = create<IUserStore>()(
  immer((set) => ({
    user: {} as IUser,
  }))
);

export const setUser = (user: IUser) => {
  useUserStore.setState({ user })
}
'use client';

import { setupAxiosInterceptors } from "@/libs/web-apis/src";
import { ReactNode, useEffect, useMemo } from "react";
import { useGetUser } from "@/libs/react-query-hooks/src";
import { setPermissions, setUser } from "../store/src";


export const AuthProvider = ({
  children,
  token,
}: {
  token: string;
  children: ReactNode;
}) => {
  //the reason why i am not putting below function in useEffect is because of the order of execution of the function is necessary. it need to call out first somehow before any other http request has been made
  setupAxiosInterceptors({ token })

  const { data: getUserResponse } = useGetUser({ enabled: !!token });
  const { user } = getUserResponse?.data || {};
  const permissions = useMemo(() => user?.role?.permissions || [], [user]);

  useEffect(() => {
    if (user) setUser(user);
    setPermissions(permissions);
  }, [user, permissions]);
  console.log(user, 'user')

  return children;
};

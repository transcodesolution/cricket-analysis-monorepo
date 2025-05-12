'use client';

import { setupAxiosInterceptors } from "@/libs/web-apis/src";
import { ReactNode } from "react";
import { useGetUser } from "@/libs/react-query-hooks/src";


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

  console.log(user, 'user')

  return children;
};

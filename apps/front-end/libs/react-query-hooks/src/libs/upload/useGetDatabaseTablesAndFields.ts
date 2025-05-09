import { getDatabaseTablesAndFields } from '@/libs/web-apis/src';
import { useQuery } from '@tanstack/react-query';

export const useGetDatabaseTablesAndFields = () => {
  return useQuery({
    queryKey: ['getDatabaseTablesAndFields'],
    queryFn: async () => getDatabaseTablesAndFields(),
    refetchOnWindowFocus: false,
  });
};
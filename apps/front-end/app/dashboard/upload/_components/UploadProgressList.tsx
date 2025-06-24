import { Flex } from '@mantine/core';
import { useSocketStore } from '@/libs/store/src/lib/socket';
import { UploadProgressCard } from './UploadProgressCard';

export const UploadProgressList = () => {
  const fileUploadStates = useSocketStore((s) => s.fileUploadStates);
  const clearSession = useSocketStore((s) => s.clearSession);

  return (
    <Flex justify='center' align='center' gap='md' direction='column'>
      {Object.values(fileUploadStates).map((uploadState) => (
        <UploadProgressCard key={uploadState.requestUniqueId} uploadState={uploadState} onUploadComplete={clearSession} />
      ))}
    </Flex>
  );
};

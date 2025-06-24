import { Stack, Text, Group, Progress, Paper } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { IFileProgressEvent } from '@/libs/types-api/src';

interface IUploadProgressCard {
  uploadState: IFileProgressEvent;
  onUploadComplete: (id: string) => void;
}

export const UploadProgressCard = ({ uploadState, onUploadComplete }: IUploadProgressCard) => {
  const { requestUniqueId, totalFiles, totalFilesProcessed, totalErroredFiles } = uploadState;
  const percent = totalFiles ? (totalFilesProcessed / totalFiles) * 100 : 0;

  const isComplete = Number(totalFilesProcessed) + Number(totalErroredFiles) === totalFiles;

  if (isComplete) {
    onUploadComplete(requestUniqueId);
    return null;
  }

  return (
    <Paper shadow="xs" radius="lg" withBorder p="md" w={896}>
      <Stack gap="xs">
        <Group gap="xs">
          <IconUpload size={16} />
          <Text fw={600} size="sm">
            Upload ID: {requestUniqueId.slice(0, 6)}…
          </Text>
        </Group>

        <Text size="xs">
          {totalFilesProcessed}/{totalFiles} files processed
        </Text>

        {totalErroredFiles > 0 && (
          <Text size="xs" c="red">
            Errors: {totalErroredFiles}
          </Text>
        )}

        <Progress
          value={percent}
          size="sm"
          radius="xl"
          striped
          animated
          color={totalErroredFiles > 0 ? 'red' : 'var(--mantine-color-customBlue-5)'}
        />
      </Stack>
    </Paper>
  );
};

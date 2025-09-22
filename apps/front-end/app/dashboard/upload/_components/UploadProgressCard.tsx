import { IFileProgressData } from '@cricket-analysis-monorepo/interfaces';
import { Stack, Text, Group, Progress, Paper } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';

interface IUploadProgressCard {
  uploadState: IFileProgressData;
  onUploadComplete: (id: string) => void;
}

export const UploadProgressCard = ({ uploadState, onUploadComplete }: IUploadProgressCard) => {
  const { requestUniqueId, totalFiles, totalFilesProcessed, totalErroredFiles, totalAlreadyUploadedFiles, } = uploadState;

  const alreadyUploadedFiles = Number(totalAlreadyUploadedFiles);
  const processed = Number(totalFilesProcessed);
  const errored = Number(totalErroredFiles);

  const totalDoneFiles = alreadyUploadedFiles + processed + errored;
  const percent = totalFiles ? (totalDoneFiles / totalFiles) * 100 : 0;

  const isComplete = totalDoneFiles === totalFiles;

  if (isComplete) {
    queueMicrotask(() => {
      onUploadComplete(requestUniqueId);
    });
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
          {processed}/{totalFiles} Files Processed
        </Text>

        {alreadyUploadedFiles > 0 && (
          <Text size="xs" >
            Already Uploaded Files: {alreadyUploadedFiles}
          </Text>
        )}

        {errored > 0 && (
          <Text size="xs" c="red">
            Errors: {errored}
          </Text>
        )}

        <Progress
          value={percent}
          size="sm"
          radius="xl"
          striped
          animated
          color={errored > 0 ? 'red' : 'var(--mantine-color-customBlue-5)'}
        />
      </Stack>
    </Paper>
  );
};

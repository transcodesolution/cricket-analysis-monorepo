'use client';

import { Text, Paper, Textarea, Button, Flex, ActionIcon } from '@mantine/core';
import { IconPlus, IconSend2, IconWorld } from '@tabler/icons-react';

export const AIAnalysisPage = () => {
  return (
    <Flex direction="column" h="calc(100vh - 143px)">
      <Flex justify="center" align="center" flex={1}>
        <Text fw={600} c="var(--mantine-color-customBlue-5)" size="xl">
          Coming Soon
        </Text>
      </Flex>
      <Paper
        withBorder
        radius="lg"
        p="md"
        styles={{ root: { borderColor: 'var(--mantine-color-gray-5)' } }}
      >
        <Textarea
          placeholder="Ask CrickAI"
          autosize
          minRows={1}
          maxRows={4}
          radius="md"
          styles={{ input: { border: 'none' } }}
          color="var(--mantine-color-gray-7)"
          c="var(--mantine-color-gray-7)"
        />
        <Flex justify="space-between" align="center" mt="sm">
          <Flex align="center" gap="sm">
            <ActionIcon radius={50} size={40} variant="default" aria-label="Upload files and more" c='var(--mantine-color-gray-7)'>
              <IconPlus size={20} />
            </ActionIcon>
            <Button size="md" radius={50} variant="default" c="var(--mantine-color-gray-7)" px={11}>
              <IconWorld size={20} style={{ marginRight: '10px' }} />
              Research
            </Button>
          </Flex>
          <ActionIcon variant="filled" color="var(--mantine-color-customBlue-5)" size={40} radius={50}>
            <IconSend2 size={20} />
          </ActionIcon>
        </Flex>
      </Paper>
    </Flex>
  );
};

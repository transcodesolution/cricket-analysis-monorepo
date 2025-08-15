import {
  Modal,
  Stack,
  Text,
  Select,
  Button,
  Title,
  Divider,
} from '@mantine/core';
import { useState } from 'react';
import {
  IUpdateAndSaveEntriesRequest,
} from '@/libs/types-api/src';
import { IFormInput } from '@cricket-analysis-monorepo/interfaces';

interface IRequiredModalData {
  data: IUpdateAndSaveEntriesRequest;
  onClose: () => void;
  onSubmit: (inputData: IUpdateAndSaveEntriesRequest) => Promise<void>;
  showRequiredInputModal: boolean;
  loading?: boolean;
}

export const RequiredInputModal = ({
  data,
  onClose,
  onSubmit,
  showRequiredInputModal,
  loading = false,
}: IRequiredModalData) => {
  const [inputs, setInputs] = useState<Record<string, Record<string, string>>>({});

  const handleChange = (referenceValue: string, inputKey: string, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [referenceValue]: {
        ...prev[referenceValue],
        [inputKey]: value,
      },
    }));
  };

  const isComplete = Object.values(data).flat().every((entry) => {
    const inputFields = (entry.inputs ?? []) as IFormInput[];
    return inputFields.every((input) => inputs[entry.referenceValue]?.[input.key]);
  });

  const handleSubmit = () => {
    const formattedData: IUpdateAndSaveEntriesRequest = {};

    Object.entries(data).forEach(([fileName, entries]) => {
      formattedData[fileName] = entries.map((entry) => {
        const inputFields = (entry.inputs ?? []) as IFormInput[];

        const inputsObject = inputFields.reduce((acc, input) => {
          acc[input.key] = inputs[entry.referenceValue]?.[input.key] ?? '';
          return acc;
        }, {} as Record<string, string>);

        return {
          referenceKey: entry.referenceKey,
          referenceValue: entry.referenceValue,
          collectionName: entry.collectionName,
          inputs: inputsObject
        };
      });
    });

     onSubmit(formattedData);
  };

  return (
    <Modal
      opened={showRequiredInputModal}
      onClose={onClose}
      title="Provide Required Info"
      size="lg"
      centered
      transitionProps={{ transition: 'fade-down', duration: 600, timingFunction: 'ease' }}
    >
      <Stack gap="md">
        {Object.entries(data).map(([fileName, entries]) =>
          entries.length > 0 ? (
            <Stack key={fileName} gap="sm">
              <Title order={4}>{fileName}</Title>
              <Divider />
              {entries.map((entry, idx) => {
                const inputFields = (entry.inputs ?? []) as IFormInput[];

                return (
                  <Stack key={`${entry.collectionName}-${idx}`} gap="xs">
                    <Title order={5}>{entry.collectionName}</Title>
                    <Text size="sm">
                      {entry.referenceKey} → {entry.referenceValue}
                    </Text>
                    {inputFields.map((input) => (
                      <Select
                        key={input.key}
                        label={input.label}
                        placeholder="Select an option"
                        value={inputs[entry.referenceValue]?.[input.key] || ''}
                        data={input.options.map((opt) => ({
                          value: opt,
                          label: opt,
                        }))}
                        onChange={(val) =>
                          handleChange(entry.referenceValue, input.key, val || '')
                        }
                        size="xs"
                      />
                    ))}
                  </Stack>
                );
              })}
            </Stack>
          ) : null
        )}

        <Button
          disabled={!isComplete || loading}
          onClick={handleSubmit}
          color="var(--mantine-color-customBlue-5)"
          w="fit-content"
          mx="auto"
          size='md'
          loading={loading}
        >
          Submit
        </Button>
      </Stack>
    </Modal>
  );
};

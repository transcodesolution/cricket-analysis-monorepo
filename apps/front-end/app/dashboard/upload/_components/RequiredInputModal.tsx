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
}

export const RequiredInputModal = ({
  data,
  onClose,
  onSubmit,
}: IRequiredModalData) => {
  const [inputs, setInputs] = useState<Record<string, Record<string, string>>>({});

  const handleChange = (fileName: string, inputKey: string, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [fileName]: {
        ...prev[fileName],
        [inputKey]: value,
      },
    }));
  };

  const isComplete = Object.entries(data).every(([fileName, fileInputs]) =>
    fileInputs.every((entry) => {
      const inputFields = (entry.inputs ?? []) as IFormInput[];
      return inputFields.every((input) => inputs[fileName]?.[input.key]);
    })
  );

  const handleSubmit = () => {
    const formattedData: IUpdateAndSaveEntriesRequest = {};

    Object.entries(data).forEach(([fileName, entries]) => {
      formattedData[fileName] = entries.map((entry) => {
        const inputFields = (entry.inputs ?? []) as IFormInput[];

        const inputsObject = inputFields.reduce((acc, input) => {
          acc[input.key] = inputs[fileName]?.[input.key] || '';
          return acc;
        }, {} as Record<string, string>);

        return {
          referenceKey: entry.referenceKey,
          referenceValue: entry.referenceValue,
          collectionName: entry.collectionName,
          inputs: inputsObject,
        };
      });
    });

    console.log('Formatted Data:', formattedData);
    onSubmit(formattedData);
  };

  return (
    <Modal
      opened
      onClose={onClose}
      title="Provide Required Info"
      size="lg"
      centered
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
                        value={inputs[fileName]?.[input.key] || ''}
                        data={input.options.map((opt) => ({
                          value: opt,
                          label: opt,
                        }))}
                        onChange={(val) =>
                          handleChange(fileName, input.key, val || '')
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
          disabled={!isComplete}
          onClick={handleSubmit}
          color="var(--mantine-color-customBlue-5)"
          w="fit-content"
          mx="auto"
        >
          Submit Inputs
        </Button>
      </Stack>
    </Modal>
  );
};

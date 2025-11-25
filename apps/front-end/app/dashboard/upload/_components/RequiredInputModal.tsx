import {
  Modal,
  Stack,
  Text,
  Select,
  Button,
  Title,
  Group,
  TextInput,
} from '@mantine/core';
import { useState } from 'react';
import {
  IUpdateAndSaveEntriesRequest,
  TFileCachedInput,
} from '@/libs/types-api/src';
import { IFormInput } from '@cricket-analysis-monorepo/interfaces';
import { IconCheck, IconPlus, IconX } from '@tabler/icons-react';
import { useVerifyEntity } from '@/libs/react-query-hooks/src';
import { showNotification } from '@mantine/notifications';
import { useDebouncedCallback } from '@mantine/hooks';

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
  const [showCustomInput, setShowCustomInput] = useState<Record<string, { visible: boolean; verified?: boolean }>>({});
  const [customInputs, setCustomInputs] = useState<Record<string, Record<string, string>>>({});
  const { mutate: verifyEntity } = useVerifyEntity();

  const debouncedVerify = useDebouncedCallback(
    (entityType: string, name: string, fileId: string, inputId: string) => {
      if (!name) return;

      verifyEntity(
        { entityType, name },
        {
          onSuccess: (res) => {
            showNotification({
              message: res.message,
              color: 'green',
              icon: <IconCheck size={16} />,
            });
            setShowCustomInput((prev) => ({
              ...prev,
              [`${fileId}-${inputId}`]: {
                ...(prev[`${fileId}-${inputId}`] || { visible: true }),
                verified: true,
              },
            }));
          },
          onError: (error) => {
            showNotification({
              message: error.message,
              color: 'red',
              icon: <IconX size={16} />,
            });
            setShowCustomInput((prev) => ({
              ...prev,
              [`${fileId}-${inputId}`]: {
                ...(prev[`${fileId}-${inputId}`] || { visible: true }),
                verified: false,
              },
            }));
          },
        }
      );
    }, 600);

  const handleChange = (
    fileId: string,
    inputId: string,
    value: string,
    isCustom?: boolean,
    canCreate?: boolean
  ) => {
    const key = `${fileId}-${inputId}`;

    if (isCustom) {
      setCustomInputs((prev) => ({
        ...prev,
        [fileId]: {
          ...prev[fileId],
          [inputId]: value,
        },
      }));

      if (canCreate) {
        setShowCustomInput((prev) => {
          const prevState = prev[key] || { visible: false, verified: false };
          return {
            ...prev,
            [key]: {
              visible: true,
              verified: value ? prevState.verified ?? false : false,
            },
          };
        });
      }
    } else {
      setInputs((prev) => ({
        ...prev,
        [fileId]: {
          ...prev[fileId],
          [inputId]: value,
        },
      }));

      if (canCreate) {
        setShowCustomInput((prev) => {
          const prevState = prev[key] || { visible: false, verified: false };
          return {
            ...prev,
            [key]: {
              visible: prevState.visible,
              verified: false,
            },
          };
        });
      }
    }
  };

  const isComplete =
    Array.isArray(data?.userInputs) &&
    data.userInputs.every((entry) => {
      const inputFields = (entry.inputs ?? []) as IFormInput[];

      return inputFields.every((input) => {
        const val = entry.fileId ? inputs[entry.fileId]?.[input.id] : undefined;

        const customState = input.isShowCreateOption
          ? showCustomInput[`${entry.fileId}-${input.id}`]
          : null;

        if (!val && customState?.visible && customState.verified === false) {
          return false;
        }

        const hasValue =
          val !== undefined &&
          val !== null &&
          (typeof val !== "string" || val.trim() !== "");

        return hasValue || (customState?.visible && customState.verified === true);
      });
    });

  const handleSubmit = () => {
    const formattedData: IUpdateAndSaveEntriesRequest = {
      fileNames: data.fileNames,
      userInputs: data.userInputs.map((entry): TFileCachedInput => {
        const inputFields = (entry.inputs ?? []) as IFormInput[];
        const fileId = entry.fileId;
        if (!fileId) return entry; // fallback

        const inputsObject = inputFields.reduce((acc, input) => {
          const inputId = input.id;
          const mainValue = inputs[fileId]?.[inputId] || '';
          const customState = showCustomInput[`${fileId}-${inputId}`];
          const customValue = customInputs[fileId]?.[inputId] || '';

          acc[input.key] =
            mainValue.trim() !== ''
              ? mainValue.trim()
              : customState?.visible && customState?.verified
                ? customValue.trim()
                : '';

          return acc;
        }, {} as Record<string, string>);

        let typedValue = '';
        let isUserTypedValue = false;

        inputFields.forEach((input) => {
          const inputId = input.id;
          const mainValue = inputs[fileId]?.[inputId] || '';
          const customValue = customInputs[fileId]?.[inputId] || '';
          const customState = showCustomInput[`${fileId}-${inputId}`];

          if (customState?.visible && customState?.verified) {
            typedValue = customValue.trim();
            isUserTypedValue = true;
          } else if (mainValue.trim() !== '') {
            typedValue = mainValue.trim();
            isUserTypedValue = false;
          }
        });

        const { inputs: _unusedInputs, ...restEntry } = entry;

        return {
          ...restEntry,
          inputObject: inputsObject,
          entityType: entry.entityType,
          typedValue,
          isUserTypedValue,
        };
      }),
    };

    onSubmit(formattedData);
  };

  const toggleCustomInput = (fileId: string, inputId: string) => {
    setShowCustomInput((prev) => {
      const key = `${fileId}-${inputId}`;
      const wasVisible = prev[key]?.visible;

      if (wasVisible) {
        clearCustomInput(fileId, inputId);
      }

      return {
        ...prev,
        [key]: {
          visible: !wasVisible,
          verified: false,
        },
      };
    });
  };

  const clearCustomInput = (fileId: string, inputId: string) => {
    setCustomInputs((prev) => {
      const updatedFileInputs = { ...(prev[fileId] || {}) };
      delete updatedFileInputs[inputId];

      return {
        ...prev,
        [fileId]: updatedFileInputs,
      };
    });
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
        {data?.userInputs?.map((entry, idx) => {
          const inputFields = (entry.inputs ?? []) as IFormInput[];
          const fileId = entry.fileId;
          if (!fileId) return null;

          return (
            <Stack key={`${entry.collectionName}-${idx}`} gap="xs">
              <Title order={5}>
                {entry.collectionName} {fileId && `(${fileId})`}
              </Title>
              <Text size="sm">
                {inputFields.length > 0 &&
                  entry.referenceKey &&
                  entry.referenceValue &&
                  `${entry.referenceKey} → ${entry.referenceValue}`}
              </Text>
              {inputFields.map((input) => {
                const canCreate = input.isShowCreateOption;
                const showCustom = showCustomInput[`${fileId}-${input.id}`];

                const isSelectDisabled = showCustom?.visible && showCustom?.verified;

                return (
                  <Stack key={input.id} gap="xs">
                    <Group justify="space-between" align="end">
                      <Select
                        label={input.label}
                        placeholder="Select an option"
                        searchable
                        value={inputs[fileId]?.[input.id] || ''}
                        data={input.options.map((opt) => ({
                          value: opt,
                          label: opt,
                        }))}
                        onChange={(val) =>
                          handleChange(fileId, input.id, val || '', false, canCreate)
                        }
                        size="xs"
                        style={{ flex: 1 }}
                        clearable
                        disabled={isSelectDisabled}
                      />

                      {canCreate && (
                        <Button
                          size="xs"
                          color="var(--mantine-color-customBlue-5)"
                          onClick={() => toggleCustomInput(fileId, input.id)}
                          disabled={!!inputs[fileId]?.[input.id]}
                          px="md"
                        >
                          {showCustom?.visible ? (
                            <IconX size={18} />
                          ) : (
                            <IconPlus size={18} />
                          )}
                        </Button>
                      )}
                    </Group>

                    {showCustom?.visible && (
                      <TextInput
                        placeholder={`Enter custom ${input.label}`}
                        value={customInputs[fileId]?.[input.id] || ''}
                        onChange={(e) => {
                          const val = e.currentTarget.value;
                          handleChange(fileId, input.id, val, true, canCreate);
                          debouncedVerify(entry.entityType, val, fileId, input.id);
                        }}
                        size="xs"
                        rightSection={
                          showCustom?.verified === true ? (
                            <IconCheck size={16} color="green" />
                          ) : null
                        }
                      />
                    )}
                  </Stack>
                );
              })}
            </Stack>
          );
        })}

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

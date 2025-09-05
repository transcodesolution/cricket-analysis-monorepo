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
    (entityType: string, name: string, fileId: string, inputKey: string) => {
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
              [`${fileId}-${inputKey}`]: {
                ...(prev[`${fileId}-${inputKey}`] || { visible: true }),
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
              [`${fileId}-${inputKey}`]: {
                ...(prev[`${fileId}-${inputKey}`] || { visible: true }),
                verified: false,
              },
            }));
          },
        }
      );
    }, 600);

  const handleChange = (
    fileId: string,
    inputKey: string,
    value: string,
    isCustom?: boolean,
    canCreate?: boolean
  ) => {
    const key = `${fileId}-${inputKey}`;

    if (isCustom) {
      setCustomInputs((prev) => ({
        ...prev,
        [fileId]: {
          ...prev[fileId],
          [inputKey]: value,
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
          [inputKey]: value,
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
        const val = entry.fileId ? inputs[entry.fileId]?.[input.key] : undefined;

        const customState = input.isShowCreateOption
          ? showCustomInput[`${entry.fileId}-${input.key}`]
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
          const key = input.key;
          const mainValue = inputs[fileId]?.[key] || '';
          const customState = showCustomInput[`${fileId}-${key}`];
          const customValue = customInputs[fileId]?.[key] || '';
          acc[key] =
            mainValue.trim() !== ''
              ? mainValue
              : customState?.visible && customState?.verified
                ? customValue
                : '';

          return acc;
        }, {} as Record<string, string>);

        let typedValue = '';
        let isUserTypedValue = false;

        inputFields.forEach((input) => {
          const key = input.key;
          const mainValue = inputs[fileId]?.[key] || '';
          const customValue = customInputs[fileId]?.[key] || '';
          const customState = showCustomInput[`${fileId}-${key}`];

          if (customState?.visible && customState?.verified) {
            typedValue = customValue;
            isUserTypedValue = true;
          } else if (mainValue.trim() !== '') {
            typedValue = mainValue;
            isUserTypedValue = false;
          }
        });

        return {
          ...entry,
          inputs: inputsObject,
          entityType: entry.entityType,
          typedValue,
          isUserTypedValue,
        };
      }),
    };

    onSubmit(formattedData);
  };

  const toggleCustomInput = (fileId: string, inputKey: string) => {
    setShowCustomInput((prev) => {
      const key = `${fileId}-${inputKey}`;
      const wasVisible = prev[key]?.visible;

      if (wasVisible) {
        clearCustomInput(fileId, inputKey);
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

  const clearCustomInput = (fileId: string, inputKey: string) => {
    setCustomInputs((prev) => {
      const updatedFileInputs = { ...(prev[fileId] || {}) };
      delete updatedFileInputs[inputKey];

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
                const showCustom = showCustomInput[`${fileId}-${input.key}`];

                const isSelectDisabled = showCustom?.visible && showCustom?.verified;

                return (
                  <Stack key={input.key} gap="xs">
                    <Group justify="space-between" align="end">
                      <Select
                        label={input.label}
                        placeholder="Select an option"
                        searchable
                        value={inputs[fileId]?.[input.key] || ''}
                        data={input.options.map((opt) => ({
                          value: opt,
                          label: opt,
                        }))}
                        onChange={(val) =>
                          handleChange(fileId, input.key, val || '', false, canCreate)
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
                          onClick={() => toggleCustomInput(fileId, input.key)}
                          disabled={!!inputs[fileId]?.[input.key]}
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
                        value={customInputs[fileId]?.[input.key] || ''}
                        onChange={(e) => {
                          const val = e.currentTarget.value;
                          handleChange(fileId, input.key, val, true, canCreate);
                          debouncedVerify(entry.entityType, val, fileId, input.key);
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

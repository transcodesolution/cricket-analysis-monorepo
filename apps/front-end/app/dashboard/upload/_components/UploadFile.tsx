'use client';
import { Dropzone, FileWithPath, MIME_TYPES } from '@mantine/dropzone';
import { Button, Center, Paper, Stack, Text } from '@mantine/core';
import { IconCloudUpload } from '@tabler/icons-react';
import React, { useState } from 'react';
import { MappingModal } from './MappingModal';
import { showNotification } from '@mantine/notifications';
import { IApiResponse } from '@cricket-analysis-monorepo/interfaces';
import { readExcelFiles } from '@/libs/utils/ui-helper';
import { IFileColumnDataResponse, IFileColumns, IUpdateAndSaveEntriesRequest, IUserMappingDetail } from '@/libs/types-api/src';
import { useCheckMappingAndUpdate } from '@/libs/react-query-hooks/src';
import { updateMappingAndCheckRequiredInputs } from '@/libs/web-apis/src';
import { RequiredInputModal } from './RequiredInputModal';
import { useUpdateAndSaveEntries } from '@/libs/react-query-hooks/src/libs/upload/useUpdateAndSaveEntries';
import classes from './upload.module.scss'

export const UploadFile = () => {
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [showRequiredInputModal, setShowRequiredInputModal] = useState(false);
  const [fileColumnData, setFileColumnData] = useState<IFileColumns[]>([]);
  const [droppedFiles, setDroppedFiles] = useState<FileWithPath[]>([]);
  const [loading, setLoading] = useState(false);
  const { mutate: checkMappingAndUpdate } = useCheckMappingAndUpdate();
  const { mutate: updateAndSaveEntries } = useUpdateAndSaveEntries();
  const [requirements, setRequirements] = useState<IUpdateAndSaveEntriesRequest>({});

  const handleDrop = (files: FileWithPath[]) => {
    if (files.length === 0) return;
    setDroppedFiles(files);
    setLoading(true);

    readExcelFiles(files)
      .then((columnsByFile) => {
        const structuredData = Object.entries(columnsByFile).map(([fileName, columns]) => ({
          fileName,
          columns,
        }));
        handleMappingCheck(structuredData, files);
      })
      .catch((error) => {
        showNotification({
          message: error?.message || 'An error occurred while checking mapping.',
          color: 'red',
        });
      }).finally(() => { setLoading(false) });
  };

  const handleMappingCheck = (structuredData: IFileColumns[], files: FileWithPath[]) => {
    checkMappingAndUpdate(
      { files: structuredData },
      {
        onSuccess: ({ data }: IApiResponse<IFileColumnDataResponse>) => {
          const hasMissingMappings = Object.values(data || {}).some(cols => cols.length > 0);

          if (hasMissingMappings) {
            const mappingDetail = Object.entries(data || {}).map(([fileName, columns]) => ({
              fileName,
              columns,
            }));
            setFileColumnData(mappingDetail);
            setShowMappingModal(true);
          } else {
            const userMappingDetail = structuredData.map(({ fileName }) => ({
              fileName,
              mappingsByUser: [],
            }));
            updateMappingAndCheck(files, userMappingDetail);
          }
        },
        onSettled: () => setLoading(false)
      }
    );
  };

  const updateMappingAndCheck = (files: FileWithPath[], userMappingDetail: IUserMappingDetail[] = []) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('sheets', file, file.name);
    });

    formData.append('userMappingDetail', JSON.stringify({ files: userMappingDetail }));

    // Upload files
    updateMappingAndCheckRequiredInputs({ formData })
      .then((response) => {
        setShowMappingModal(false);
        setDroppedFiles([]);
        if (response.statusCode === 200) {
          const hasInputs = Object.values(response.data ?? {}).some((arr) =>
            arr.some((item) => item.inputs && Number(item.inputs.length) > 0)
          );
          if (hasInputs) {
            setShowRequiredInputModal(true);
            setRequirements(response?.data ?? {});
          } else {
            const inputData: IUpdateAndSaveEntriesRequest = {};
            const fileNames = Object.keys(response.data ?? {});

            fileNames.forEach((fileName) => {
              inputData[fileName] = [];
            });
            handleRequirementSubmit(inputData);
          }
        }
      })
      .catch((error) => {
        showNotification({
          message: error?.message || 'Something went wrong while uploading.',
          color: 'red',
        });
      }).finally(() => { setLoading(false) })
  };

  const handleMappingSubmit = async (userMappingDetail: IUserMappingDetail[]) => {
    updateMappingAndCheck(droppedFiles, userMappingDetail);
  };

  const handleRequirementSubmit = async (inputData: IUpdateAndSaveEntriesRequest) => {
    updateAndSaveEntries(inputData, {
      onSuccess: (response) => {
        showNotification({
          message: response.message,
          color: 'green',
        });
        setShowRequiredInputModal(false);
        setRequirements({});
      },
      onError: (error) => {
        showNotification({
          message: error?.message || 'An error occurred while saving inputs.',
          color: 'red',
        });
      },
    }
    );
  };

  return (
    <>
      <Center>
        <Paper shadow="xs" radius="lg" withBorder p="xs" w={896} mt="lg" className={classes.zoomUpDropzone}>
          <Dropzone
            onDrop={handleDrop}
            radius="lg"
            accept={[MIME_TYPES.csv, MIME_TYPES.xlsx]}
            multiple
            loading={loading}
          >
            <Stack align="center" justify="center" py="xl">
              <IconCloudUpload size={48} color="gray" />
              <Text size="20px" fw={500}>
                Drag and drop file here or
              </Text>
              <Text c="var(--mantine-color-gray-7)" size="md">
                The file should be in the supported template format
              </Text>
              <Button mt="sm" color="var(--mantine-color-customBlue-5)" size="lg">
                Browse Files
              </Button>
            </Stack>
          </Dropzone>
        </Paper>
      </Center>

      <MappingModal
        keysToMapByFile={fileColumnData}
        onClose={() => setShowMappingModal(false)}
        onSubmit={handleMappingSubmit}
        showMappingModal={showMappingModal}
      />

      <RequiredInputModal
        data={requirements}
        onClose={() => setShowRequiredInputModal(false)}
        onSubmit={handleRequirementSubmit}
        showRequiredInputModal={showRequiredInputModal}
      />
    </>
  );
};

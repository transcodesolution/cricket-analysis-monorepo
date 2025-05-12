'use client';
import { Dropzone, FileWithPath, MIME_TYPES } from '@mantine/dropzone';
import { Button, Center, Paper, Stack, Text } from '@mantine/core';
import { IconCloudUpload } from '@tabler/icons-react';
import React, { useState } from 'react';
import { MappingModal } from './MappingModal';
import { showNotification } from '@mantine/notifications';
import { IApiResponse } from '@cricket-analysis-monorepo/interfaces';
import { readExcelFiles } from '@/libs/utils/ui-helper';
import { IFileColumnDataResponse, IFileColumns, IUserMappingDetail } from '@/libs/types-api/src';
import { useCheckMappingAndUpdate } from '@/libs/react-query-hooks/src';
import { uploadFileToServiceViaHandler } from '@/libs/web-apis/src';

export const UploadFile = () => {
  const [showModal, setShowModal] = useState(false);
  const [fileColumnData, setFileColumnData] = useState<IFileColumns[]>([]);
  const [droppedFiles, setDroppedFiles] = useState<FileWithPath[]>([]);
  const [loading, setLoading] = useState(false);
  const { mutate: checkMappingAndUpdate } = useCheckMappingAndUpdate();

  const handleDrop = (files: FileWithPath[]) => {
    if (files.length === 0) return;
    setDroppedFiles(files);

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
      });
  };

  const handleMappingCheck = (structuredData: IFileColumns[], files: FileWithPath[]) => {
    setLoading(true)
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
            setShowModal(true);
          } else {
            const userMappingDetail = structuredData.map(({ fileName }) => ({
              fileName,
              mappingsByUser: [],
            }));
            uploadFilesToService(files, userMappingDetail);
          }
        },
        onSettled: () => setLoading(false)
      }
    );
  };

  const uploadFilesToService = (files: FileWithPath[], userMappingDetail: IUserMappingDetail[] = []) => {
    setLoading(true);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('sheets', file, file.name);
    });

    formData.append('userMappingDetail', JSON.stringify({ files: userMappingDetail }));

    // Upload files
    uploadFileToServiceViaHandler({ formData })
      .then(() => {
        setShowModal(false);
        setDroppedFiles([]);
      })
      .catch((error) => {
        console.log(error, 'error')
        showNotification({
          message: error?.message || 'Something went wrong while uploading.',
          color: 'red',
        });
      }).finally(() => { setLoading(false) })
  };

  const submitFinalUserMapping = async (userMappingDetail: IUserMappingDetail[]) => {
    uploadFilesToService(droppedFiles, userMappingDetail);
  };

  return (
    <>
      <Center>
        <Paper shadow="xs" radius="lg" withBorder p="xs" w={896} mt="lg">
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

      {showModal && (
        <MappingModal
          keysToMapByFile={fileColumnData}
          onClose={() => setShowModal(false)}
          onSubmit={submitFinalUserMapping}
        />
      )}
    </>
  );
};

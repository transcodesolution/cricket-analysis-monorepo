'use client';

import { useGetDatabaseTablesAndFields } from '@/libs/react-query-hooks/src';
import { IFileColumns, IMappingByUser, IUserMappingDetail } from '@/libs/types-api/src';
import {
  Modal,
  Button,
  Stack,
  Text,
  Select,
  Table,
  ScrollArea,
  Title,
  Divider,
} from '@mantine/core';
import { useState } from 'react';

interface IMappingModalData {
  keysToMapByFile: IFileColumns[];
  onClose: () => void;
  onSubmit: (userMappingDetail: IUserMappingDetail[]) => Promise<void>;
}

export const MappingModal = ({ keysToMapByFile, onClose, onSubmit }: IMappingModalData) => {
  const [mapping, setMapping] = useState<Record<string, Record<string, { table: string; key: string }>>>({});
  const { data: getDatabaseTablesAndFieldsResponse } = useGetDatabaseTablesAndFields();
  const tablesAndFields = getDatabaseTablesAndFieldsResponse?.data || [];

  const handleChange = (fileName: string, originalKey: string, table: string, key = '') => {
    setMapping((prev) => ({
      ...prev,
      [fileName]: {
        ...(prev[fileName] || {}),
        [originalKey]: { table, key },
      },
    }));
  };

  const tableOptions = tablesAndFields?.map((table) => ({
    value: table.name,
    label: table.name,
  }));

  const renderRows = (fileName: string, columns: string[]) =>
    columns.map((originalKey) => {
      const selectedTable = mapping[fileName]?.[originalKey]?.table || '';
      const selectedKey = mapping[fileName]?.[originalKey]?.key || '';

      const fieldOptions =
        tablesAndFields.find((t) => t.name === selectedTable)?.fields.map((f) => ({
          value: f,
          label: f,
        })) || [];

      return (
        <Table.Tr key={originalKey}>
          <Table.Td>
            <Text size="sm" lineClamp={1}>{originalKey}</Text>
          </Table.Td>
          <Table.Td>
            <Select
              placeholder="Select table"
              value={selectedTable}
              data={tableOptions}
              onChange={(table) => handleChange(fileName, originalKey, table || '', '')}
              size="xs"
            />
          </Table.Td>
          <Table.Td>
            <Select
              placeholder="Select field"
              value={selectedKey}
              data={fieldOptions}
              onChange={(key) => handleChange(fileName, originalKey, selectedTable, key || '')}
              disabled={!selectedTable}
              searchable
              size="xs"
            />
          </Table.Td>
        </Table.Tr>
      );
    });

  const isMappingComplete = keysToMapByFile.every((file) =>
    file.columns.every(
      (col) => mapping[file.fileName]?.[col]?.table && mapping[file.fileName]?.[col]?.key
    )
  );

  const filteredKeysToMapByFile = keysToMapByFile.filter((file) => file.columns.length > 0);

  const handleSubmit = () => {
    const userMappingDetail: IUserMappingDetail[] = keysToMapByFile.map((file) => {
      const fileMapping = mapping[file.fileName] || {};
      const tableKeyMap: Record<string, Record<string, string[]>> = {};

      for (const [field, { table, key }] of Object.entries(fileMapping)) {
        if (!table || !key) continue;

        if (!tableKeyMap[table]) tableKeyMap[table] = {};
        if (!tableKeyMap[table][key]) tableKeyMap[table][key] = [];

        tableKeyMap[table][key].push(field);
      }

      const mappingsByUser: IMappingByUser[] = Object.entries(tableKeyMap).map(
        ([collectionName, fields]) => ({
          collectionName,
          fields,
        })
      );
      return {
        fileName: file.fileName,
        mappingsByUser,
      };
    });

    onSubmit(userMappingDetail);
  };


  return (
    <Modal opened onClose={onClose} title="Map Your Columns" size="xl" centered>
      <Stack gap="md">
        {filteredKeysToMapByFile.length > 0 ? (
          filteredKeysToMapByFile.map(({ fileName, columns }) => (
            <Stack key={fileName} gap="xs">
              <Title order={5}>{fileName}</Title>
              <ScrollArea h={200}>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Column</Table.Th>
                      <Table.Th>Table</Table.Th>
                      <Table.Th>Field</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>{renderRows(fileName, columns)}</Table.Tbody>
                </Table>
              </ScrollArea>
              <Divider />
            </Stack>
          ))
        ) : (
          <Text>No mappings available for the selected files.</Text>
        )}

        <Button
          w="fit-content"
          mx="auto"
          size="md"
          color="var(--mantine-color-customBlue-5)"
          onClick={handleSubmit}
          disabled={!isMappingComplete}
        >
          Submit Mapping
        </Button>
      </Stack>
    </Modal>
  );
};

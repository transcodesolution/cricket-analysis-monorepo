'use client';

import { useGetDatabaseTablesAndFields } from '@/libs/react-query-hooks/src';
import { IFileColumns, IMappingByUser, ITableField, IUserMappingDetail } from '@/libs/types-api/src';
import {
  Modal,
  Button,
  Stack,
  Text,
  Select,
  Table,
  ScrollArea,
} from '@mantine/core';
import { useState } from 'react';

interface IMappingModalData {
  keysToMapByFile: IFileColumns[];
  onClose: () => void;
  onSubmit: (userMappingDetail: IUserMappingDetail[]) => Promise<void>;
  showMappingModal: boolean;
  loading?: boolean;
}
export const MappingModal = ({ keysToMapByFile, onClose, onSubmit, showMappingModal, loading }: IMappingModalData) => {
  const [mapping, setMapping] = useState<Record<string, { table: string; key: string }>>({});
  const { data: getDatabaseTablesAndFieldsResponse } = useGetDatabaseTablesAndFields();
  const tablesAndFields = getDatabaseTablesAndFieldsResponse?.data || [];

  const handleChange = (originalKey: string, table: string, key = '') => {
    setMapping((prev) => ({
      ...prev,
      [originalKey]: { table, key },
    }));
  };

  const tableOptions = tablesAndFields.map((table: ITableField) => ({
    value: table.name,
    label: table.name,
  }));

  const renderRows = (columns: string[]) =>
    columns.map((originalKey) => {
      const selectedTable = mapping[originalKey]?.table || '';
      const selectedKey = mapping[originalKey]?.key || '';

      const fieldOptions =
        tablesAndFields.find((t) => t.name === selectedTable)?.fields.map((f) => ({
          value: f,
          label: f,
        })) || [];

      return (
        <Table.Tr key={originalKey}>
          <Table.Td>
            <Text size="sm">{originalKey}</Text>
          </Table.Td>
          <Table.Td>
            <Select
              placeholder="Select table"
              value={selectedTable}
              data={tableOptions}
              onChange={(table) => handleChange(originalKey, table || '', '')}
              size="xs"
            />
          </Table.Td>
          <Table.Td>
            <Select
              placeholder="Select field"
              value={selectedKey}
              data={fieldOptions}
              onChange={(key) => handleChange(originalKey, selectedTable, key || '')}
              disabled={!selectedTable}
              searchable
              size="xs"
            />
          </Table.Td>
        </Table.Tr>
      );
    });

  const allColumns = keysToMapByFile.flatMap((file) => file.columns);

  const isMappingComplete = allColumns.every(
    (col) => mapping[col]?.table && mapping[col]?.key
  );

  const handleSubmit = () => {
    const tableKeyMap: Record<string, Record<string, string[]>> = {};

    for (const [field, { table, key }] of Object.entries(mapping)) {
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

    const userMappingDetail: IUserMappingDetail = {
      fileNames: [],
      mappingsByUser,
    };

    onSubmit([userMappingDetail]).then(() => {
      setMapping({});
    });;
  };

  return (
    <Modal opened={showMappingModal} onClose={onClose} title="Map Your Columns" size="xl" centered>
      <Stack gap="md">
        {allColumns.length > 0 ? (
          <ScrollArea h={300}>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Column</Table.Th>
                  <Table.Th>Table</Table.Th>
                  <Table.Th>Field</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{renderRows(allColumns)}</Table.Tbody>
            </Table>
          </ScrollArea>
        ) : (
          <Text>No mappings available for the selected files.</Text>
        )}

        <Button
          w="fit-content"
          mx="auto"
          size="md"
          color="var(--mantine-color-customBlue-5)"
          onClick={handleSubmit}
          disabled={!isMappingComplete || loading}
          loading={loading}
        >
          Submit Mapping
        </Button>
      </Stack>
    </Modal>
  );
};

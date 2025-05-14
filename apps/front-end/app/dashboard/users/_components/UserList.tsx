'use client';
import { useConfirmDelete } from '@/libs/hooks/useConfirmDelete';
import { useDeleteUsers, useGetUsers } from '@/libs/react-query-hooks/src';
import { IFilterParams, updateUrlParams } from '@/libs/utils/updateUrlParams';
import { IUser } from '@cricket-analysis-monorepo/interfaces';
import { ActionIcon, Anchor, Text } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable'
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react'

const PAGE_SIZES = [50, 100, 200, 500, 1000];
const SORT_ORDER = ['asc', 'desc'];

export const UserList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || PAGE_SIZES[0];
  const search = searchParams.get('search') || ''
  const sortColumn = searchParams.get('sortColumn') || 'lastUpdatedDate';
  const sortOrder = SORT_ORDER.includes(searchParams.get('sortOrder') || '') ? searchParams.get('sortOrder') : 'desc';
  const { data: getUserResponse, isLoading, refetch } = useGetUsers({ page: Number(page), limit: Number(pageSize), search: search });
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const { deleteUsersMutation } = useDeleteUsers()
  const userData = getUserResponse?.data?.users;
  const confirmDelete = useConfirmDelete();

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<IUser>>({
    columnAccessor: sortColumn,
    direction: sortOrder as 'asc' | 'desc',
  });
  const handleApplyFilter = (filters: IFilterParams) => {
    const newSearchParams = updateUrlParams(filters);
    router.push(`${newSearchParams.toString()}`);
  };

  const handleChangePage = (pageNumber: number) => {
    handleApplyFilter({ 'page': pageNumber.toString() })
  };

  const handleChangePageSize = (pageNumber: number) => {
    handleApplyFilter({ 'pageSize': pageNumber.toString() })
  };

  const handleSortStatusChange = (status: DataTableSortStatus<IUser>) => {
    handleChangePage(1);
    setSortStatus?.(status);
  };

  const columns: DataTableColumn<IUser>[] = [
    {
      accessor: 'firstName',
      title: 'Name',
      ellipsis: true,
      sortable: true,
      width: 'auto',
      render: ({ firstName, lastName, _id }) => {
        return (
          <Anchor component={Link} href={`/dashboard/users/${_id}`} style={{ position: 'relative' }}>
            {firstName || lastName ? `${firstName ?? ''} ${lastName ?? ''}`.trim() : '-'}
          </Anchor>
        );
      },
    },
    {
      accessor: 'email',
      title: 'Email',
      ellipsis: true,
      sortable: true,
      width: 'auto',
      render: ({ email }) => {
        return (
          <Text c='primary'>{email || '-'}</Text>
        );
      },
    },
    {
      accessor: 'role',
      title: 'Role',
      ellipsis: true,
      sortable: true,
      width: 'auto',
      render: ({ role }) => <Text>{role?.name}</Text>,
    },
  ]

  const handleDeleteSelected = () => {
    const ids = selectedUsers.map((user) => String(user._id));

    confirmDelete({
      itemName: ids.length > 1 ? 'these users' : 'this user',
      onConfirm: () => {
        deleteUsersMutation.mutate(
          { ids },
          {
            onSuccess: () => {
              refetch();
              setSelectedUsers([]);
            },
          }
        );
      },
    });
  };

  return (
    <React.Fragment>
      {selectedUsers.length > 0 &&
        <ActionIcon color='red' onClick={handleDeleteSelected}>
          <IconTrash size="1.5rem" />
        </ActionIcon>
      }
      <DataTable
        mt="md"
        idAccessor='_id'
        highlightOnHover
        records={userData}
        fetching={isLoading}
        selectedRecords={selectedUsers}
        onSelectedRecordsChange={setSelectedUsers}
        page={page}
        onPageChange={handleChangePage}
        totalRecords={3}
        recordsPerPage={pageSize}
        recordsPerPageOptions={PAGE_SIZES}
        onRecordsPerPageChange={handleChangePageSize}
        noRecordsText='No Data To Show'
        recordsPerPageLabel=""
        sortStatus={sortStatus}
        onSortStatusChange={handleSortStatusChange}
        columns={columns}
        borderRadius="lg"
        withTableBorder
        withRowBorders={false}
        verticalSpacing="xs"
        paginationActiveBackgroundColor="var(--mantine-color-customBlue-5)"
        c="var(--mantine-color-gray-7)"
        styles={{
          header: {
            backgroundColor: 'var(--mantine-color-gray-1)',
            color: 'var(--mantine-color-gray-7)',
          },
        }}
        height="calc(100vh - 400px)"
      />
    </React.Fragment>
  )
}
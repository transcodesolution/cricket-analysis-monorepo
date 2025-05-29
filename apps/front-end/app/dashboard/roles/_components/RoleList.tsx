'use client'
import { IFilterParams, updateUrlParams } from '@/libs/utils/updateUrlParams';
import { ActionIcon, Anchor, Text } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable'
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react'
import { usePermissions } from '@/libs/hooks/usePermissions';
import { useConfirmDelete } from '@/libs/hooks/useConfirmDelete';
import { useDeleteRoles, useGetRoles } from '@/libs/react-query-hooks/src';
import { IUserRole } from '@cricket-analysis-monorepo/interfaces';

const PAGE_SIZES = [10, 20, 50, 100];
const SORT_ORDER = ['asc', 'desc'];

export const RoleList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || PAGE_SIZES[0];
  const search = searchParams.get('search') || ''
  const sortColumn = searchParams.get('sortColumn') || 'lastUpdatedDate';
  const sortOrder = SORT_ORDER.includes(searchParams.get('sortOrder') || '') ? searchParams.get('sortOrder') : 'desc';

  const { data: getRolesResponse, isLoading, refetch } = useGetRoles({ page, limit: pageSize, search });
  const rolesData = getRolesResponse?.data?.roles;
  const totalData = getRolesResponse?.data?.totalData
  const [selectedRoles, setSelectedRoles] = useState<IUserRole[]>([]);
  const { deleteRolesMutation } = useDeleteRoles();
  const permission = usePermissions()
  const confirmDelete = useConfirmDelete();

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<IUserRole>>({
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

  const handleSortStatusChange = (status: DataTableSortStatus<IUserRole>) => {
    handleChangePage(1);
    setSortStatus?.(status);
  };

  const columns: DataTableColumn<IUserRole>[] = [
    {
      accessor: 'name',
      title: 'Role Name',
      ellipsis: true,
      sortable: true,
      render: ({ name, _id }) => {
        return (
          <Anchor component={Link} href={`/dashboard/roles/${_id}`} style={{ position: 'relative' }}>{name || '-'}</Anchor>
        );
      },
    },
    {
      accessor: 'type',
      title: 'Type',
      ellipsis: true,
      sortable: true,
      render: ({ type }) => {
        return (
          <Text c='primary'>{type || 'custom'}</Text>
        );
      },
    },
    {
      accessor: 'permissions',
      title: 'Permissions',
      ellipsis: true,
      sortable: true,
      render: ({ permissions }) => <Text>{permissions?.length || 0}</Text>,
    },
  ]

  const handleDeleteSelected = () => {
    const roleIds = selectedRoles.map((role) => String(role._id));
    confirmDelete({
      itemName: roleIds.length > 1 ? 'these roles' : 'this role',
      onConfirm: () => {
        deleteRolesMutation.mutate(
          { roleIds },
          {
            onSuccess: () => {
              refetch();
              setSelectedRoles([]);
            },
          }
        );
      },
    });
  }

  return (
    <React.Fragment>
      {
        permission?.hasRoleDelete && selectedRoles.length > 0 &&
        <ActionIcon color='red' onClick={handleDeleteSelected}>
          <IconTrash size="1.5rem" />
        </ActionIcon>
      }
      <DataTable
        idAccessor='_id'
        highlightOnHover
        records={rolesData}
        fetching={isLoading}
        selectedRecords={selectedRoles}
        onSelectedRecordsChange={setSelectedRoles}
        page={page}
        onPageChange={handleChangePage}
        totalRecords={totalData}
        recordsPerPage={pageSize}
        recordsPerPageOptions={PAGE_SIZES}
        onRecordsPerPageChange={handleChangePageSize}
        noRecordsText='No Data To Show'
        recordsPerPageLabel=""
        sortStatus={sortStatus}
        onSortStatusChange={handleSortStatusChange}
        columns={columns}
        withTableBorder
        withRowBorders={false}
        verticalSpacing="xs"
        borderRadius="lg"
        paginationActiveBackgroundColor="var(--mantine-color-customBlue-5)"
        c="var(--mantine-color-gray-7)"
        styles={{
          header: {
            backgroundColor: 'var(--mantine-color-gray-1)',
            color: 'var(--mantine-color-gray-7)',
          },
        }}
        height="calc(100vh - 280px)"
      />
    </React.Fragment >
  )
}
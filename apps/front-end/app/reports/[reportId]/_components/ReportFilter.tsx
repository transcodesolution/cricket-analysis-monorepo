'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Flex, Paper, Select } from '@mantine/core';
import { useMemo } from 'react';
import { IFilterParams, updateUrlParams } from '@/libs/utils/updateUrlParams';
import { IReportFilters } from '@/libs/types-api/src';

interface IReportFilter {
  filters: IReportFilters[];
}

export const ReportFilter = ({ filters }: IReportFilter) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const parsedFilters = useMemo(() => {
    return filters.map((filter) => {
      const vals = filter.values ?? [];

      const uniqueVals = [
        ...new Set(
          vals.map((val) => {
            if (typeof val === 'object' && val !== null) {
              return String(val.value);
            }
            return String(val);
          })
        ),
      ];

      const filterData = [
        { value: 'all', label: 'All' },
        ...uniqueVals.map((val) => {
          const matchingVal = vals.find((v) => {
            if (typeof v === 'object' && v !== null) {
              return v.value === val;
            }
            return String(v) === val;
          });

          const label = typeof matchingVal === 'object' && matchingVal !== null
            ? matchingVal.label
            : val;

          return { value: val, label };
        }),
      ];

      return {
        label: filter.label,
        placeholder: 'All',
        key: filter.label.toLowerCase(),
        data: filterData,
      };
    });
  }, [filters]);

  const handleApplyFilter = (filters: IFilterParams) => {
    const newSearchParams = updateUrlParams(filters);
    router.push(`${newSearchParams.toString()}`);
  };

  return (
    <Flex gap="sm" styles={{ root: { overflowX: 'auto' } }}>
      {parsedFilters?.map((cfg) => (
        <Paper
          key={cfg.key}
          bg="var(--mantine-color-gray-1)"
          p="xs"
          radius="md"
          withBorder
          miw={180}
        >
          <Select
            label={cfg.label}
            placeholder={cfg.placeholder}
            data={cfg.data}
            size="sm"
            clearable
            value={searchParams.get(cfg.key) || null}
            onChange={(value) => {
              handleApplyFilter({ [cfg.key]: !value || value === 'all' ? undefined : value });
            }}
          />
        </Paper>
      ))}
    </Flex>
  );
};

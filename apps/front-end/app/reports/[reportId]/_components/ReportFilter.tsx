import { useRouter, useSearchParams } from 'next/navigation';
import { Flex, Paper, Select, MultiSelect } from '@mantine/core';
import { DatePickerInput, DatesRangeValue } from '@mantine/dates';
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { IFilterParams, updateUrlParams } from '@/libs/utils/updateUrlParams';
import { IReportFilters } from '@/libs/types-api/src';

interface IFilter {
  type: 'date-range' | 'select' | 'multi-select';
  label: string;
  key: string;
  data?: { label: string; value: string }[];
  isMultiSelect?: boolean;
}

interface IReportFilter {
  reportFilters: IReportFilters[];
}

export const ReportFilter = ({ reportFilters }: IReportFilter) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const [dateRange, setDateRange] = useState<DatesRangeValue>([
    startDate ? new Date(startDate) : null,
    endDate ? new Date(endDate) : null,
  ]);

  const filters: IFilter[] = useMemo(() => {
    return reportFilters.map((filter) => {
      const { label, type, values = [], queryParameterKey, isMultiSelectOption } = filter;

      if (type === 'date-range') {
        return {
          type: 'date-range',
          label,
          key: queryParameterKey ?? 'dateRange',
        };
      }

      const filterData = [
        { value: 'all', label: 'All' },
        ...values.map((val: { label: string; value: string } | string) =>
          typeof val === 'object' && val.label && val.value
            ? { label: String(val.label), value: String(val.value) }
            : { label: String(val), value: String(val) }
        ),
      ];

      return {
        type: isMultiSelectOption ? 'multi-select' : 'select',
        label,
        key: queryParameterKey ?? label,
        data: filterData,
        isMultiSelect: isMultiSelectOption ?? false,
      };
    });
  }, [reportFilters]);

  const handleApplyFilter = (filters: IFilterParams) => {
    const newSearchParams = updateUrlParams(filters);
    router.push(`${newSearchParams.toString()}`);
  };

  const handleDateChange = (range: DatesRangeValue) => {
    setDateRange(range);
    const [start, end] = range;
    if (start && end) {
      handleApplyFilter({
        startDate: dayjs(start).format('YYYY-MM-DD'),
        endDate: dayjs(end).format('YYYY-MM-DD'),
      });
    }
  };

  const renderFilterField = (filter: IFilter) => {
    switch (filter.type) {
      case 'date-range':
        return (
          <DatePickerInput
            type="range"
            label={filter.label}
            value={dateRange}
            onChange={handleDateChange}
            placeholder="Select Year Range"
          />
        );

      case 'multi-select':
        return (
          <MultiSelect
            label={filter.label}
            placeholder={filter.label}
            data={filter.data || []}
            size="sm"
            value={(searchParams.get(filter.key)?.split(',') || []) as string[]}
            onChange={(values) => {
              handleApplyFilter({
                [filter.key]: values.length === 0 || values.includes('all') ? undefined : values.join(','),
              });
            }}
            max={207}
            styles={{
              input: {
                height: '2.2em',
                width: '207px',
                overflowX: 'auto',
                overflowY: 'hidden',
              },
              pillsList: {
                flexWrap: 'nowrap',
              },
            }}
          />
        );

      case 'select':
      default:
        return (
          <Select
            label={filter.label}
            placeholder={filter.label}
            data={filter.data || []}
            size="sm"
            clearable
            value={searchParams.get(filter.key) || null}
            onChange={(value) => {
              handleApplyFilter({
                [filter.key]: !value || value === 'all' ? undefined : value,
              });
            }}
          />
        );
    }
  };

  return (
    <Flex gap="sm" wrap="wrap">
      {filters.map((filter) => (
        <Paper
          key={filter.key}
          bg="var(--mantine-color-gray-1)"
          p="xs"
          radius="md"
          withBorder
          miw={220}
        >
          {renderFilterField(filter)}
        </Paper>
      ))}
    </Flex>
  );
};
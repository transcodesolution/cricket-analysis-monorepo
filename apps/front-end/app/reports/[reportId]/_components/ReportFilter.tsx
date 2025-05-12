import { useRouter, useSearchParams } from 'next/navigation';
import { Flex, Paper, Select, MultiSelect } from '@mantine/core';
import { DatePickerInput, DatesRangeValue } from '@mantine/dates';
import { useState } from 'react';
import dayjs from 'dayjs';
import { IFilterParams, updateUrlParams } from '@/libs/utils/updateUrlParams';
import { IReportFilter } from '@cricket-analysis-monorepo/interfaces';
import { ReportFilterType } from '@cricket-analysis-monorepo/constants';

interface IReportFilters {
  reportFilters: IReportFilter[];
}

export const ReportFilter = ({ reportFilters }: IReportFilters) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const [dateRange, setDateRange] = useState<DatesRangeValue>([
    startDate ? new Date(startDate) : null,
    endDate ? new Date(endDate) : null,
  ]);

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

  const renderFilterField = (filter: IReportFilter) => {
    const key = filter.queryParameterKey ?? filter.label;

    if (filter.type === ReportFilterType.DATE_RANGE) {
      return (
        <DatePickerInput
          type="range"
          label={filter.label}
          value={dateRange}
          onChange={handleDateChange}
          placeholder="Select Year Range"
        />
      );
    }

    const options = [
      { value: 'all', label: 'All' },
      ...filter.values.map((val) =>
        typeof val === 'object' && 'label' in val && 'value' in val
          ? { label: String(val.label), value: String(val.value) }
          : { label: String(val), value: String(val) }
      ),
    ];

    if (filter.isMultiSelectOption) {
      return (
        <MultiSelect
          label={filter.label}
          placeholder={filter.label}
          data={options}
          size="sm"
          value={(searchParams.get(key)?.split(',') || []) as string[]}
          onChange={(values) => {
            handleApplyFilter({
              [key]: values.length === 0 || values.includes('all') ? undefined : values.join(','),
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
    }

    return (
      <Select
        label={filter.label}
        placeholder={filter.label}
        data={options}
        size="sm"
        clearable
        value={searchParams.get(key) || null}
        onChange={(value) => {
          handleApplyFilter({
            [key]: !value || value === 'all' ? undefined : value,
          });
        }}
      />
    );
  };

  return (
    <Flex gap="sm" wrap="wrap">
      {reportFilters.map((filter) => (
        <Paper
          key={filter.queryParameterKey ?? filter.label}
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
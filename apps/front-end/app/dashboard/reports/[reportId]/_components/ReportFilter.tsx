import { useRouter, useSearchParams } from 'next/navigation';
import { Flex, Paper, Select, MultiSelect } from '@mantine/core';
import { DatePickerInput, DatesRangeValue } from '@mantine/dates';
import dayjs from 'dayjs';
import { IFilterParams, updateUrlParams } from '@/libs/utils/updateUrlParams';
import { IReportFilter } from '@cricket-analysis-monorepo/interfaces';
import { ReportFilterType } from '@cricket-analysis-monorepo/constants';
import React from 'react';

interface IReportFilters {
  reportFilters: IReportFilter[];
  width?: string
}

export const ReportFilter = ({ reportFilters, width }: IReportFilters) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');


  const handleApplyFilter = (filters: IFilterParams) => {
    const newSearchParams = updateUrlParams(filters);
    router.push(`${newSearchParams.toString()}`);
  };

  const handleDateChange = (range: DatesRangeValue) => {
    const [start, end] = range;
    if (start && end) {
      handleApplyFilter({
        startDate: dayjs(start).format('YYYY-MM-DD'),
        endDate: dayjs(end).format('YYYY-MM-DD'),
      });
    }

    if (!start && !end) {
      handleApplyFilter({
        startDate: '',
        endDate: '',
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
          defaultValue={[startDate, endDate]}
          onChange={handleDateChange}
          placeholder="Select Year Range"
          clearable
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
    const defaultSelectedValues = filter.singleFilterConfig?.selectedValues;
    const param = searchParams.get(key);

    const activeSingleValue = param ?? defaultSelectedValues?.[0] ?? 'all';
    const activeMultiValues =
      param?.split(',') ??
      (defaultSelectedValues?.length ? defaultSelectedValues : ['all']);
    const isMultiSelect = filter?.singleFilterConfig?.isMultiSelectOption ?? filter.isMultiSelectOption;

    if (isMultiSelect) {
      return (
        <MultiSelect
          label={filter.label}
          placeholder={filter.label}
          data={options}
          size="sm"
          searchable
          value={activeMultiValues}
          onChange={(values) => {
            handleApplyFilter({
              [key]: values.length === 0 || values.includes('all') ? undefined : values.join(','),
            });
          }}
          max={width ?? 208}
          styles={{
            input: {
              height: '2.2em',
              width: width ?? '13rem',
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
        searchable
        clearable
        value={activeSingleValue}
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
          miw={width ?? 220}
        >
          {renderFilterField(filter)}
        </Paper>
      ))}
    </Flex>
  );
};
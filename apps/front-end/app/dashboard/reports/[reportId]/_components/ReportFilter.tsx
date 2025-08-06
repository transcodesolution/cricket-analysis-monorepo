import { useRouter, useSearchParams } from 'next/navigation';
import { Flex, Paper, Select, MultiSelect } from '@mantine/core';
import { DatePickerInput, DatesRangeValue } from '@mantine/dates';
import dayjs from 'dayjs';
import { IFilterParams, updateUrlParams } from '@/libs/utils/updateUrlParams';
import { IReportFilter } from '@cricket-analysis-monorepo/interfaces';
import { ReportFilterType } from '@cricket-analysis-monorepo/constants';
import React, { useState } from 'react';

interface IReportFilters {
  reportFilters: IReportFilter[];
  width?: string
}

export const ReportFilter = ({ reportFilters, width }: IReportFilters) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const [multiSelectValues, setMultiSelectValues] = useState<Record<string, string[]>>({});
  const [singleSelectValues, setSingleSelectValues] = useState<Record<string, string | null>>({});

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

  const handleMultiSelectChange = (key: string, val: string[]) => {
    let newVal = val;

    if (val.includes('all') && val.length > 1) {
      newVal = val.filter((v) => v !== 'all');
    }

    if (newVal.length === 0) {
      newVal = ['all'];
    }

    setMultiSelectValues((prev) => ({
      ...prev,
      [key]: newVal,
    }));

    // Apply filter
    if (newVal.includes('all')) {
      handleApplyFilter({ [key]: undefined });
    } else {
      handleApplyFilter({ [key]: newVal.join(',') });
    }
  };

  const handleSingleSelectChange = (key: string, value: string | null) => {
    let newValue = value;
    if (!value) {
      newValue = 'all';
    }
    setSingleSelectValues((prev) => ({
      ...prev,
      [key]: newValue,
    }));

    handleApplyFilter({
      [key]: !newValue || newValue === 'all' ? undefined : newValue,
    });
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
    const stateValue = singleSelectValues[key];
    const param = searchParams.get(key);
    const activeMultiValues = param?.split(',') ?? multiSelectValues[key] ?? (defaultSelectedValues?.length ? defaultSelectedValues : ['all']);
    const activeSingleValue =
      stateValue !== undefined
        ? stateValue === '' ? null : stateValue
        : param ?? defaultSelectedValues?.[0] ?? 'all';
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
          onFocus={() => setMultiSelectValues((prev) => ({
            ...prev,
            [key]: [],
          }))
          }
          onChange={(val) => handleMultiSelectChange(key, val)}
          onBlur={() => setMultiSelectValues((prev) => ({
            ...prev,
            [key]: [],
          }))
          }
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
        onFocus={() => {
          if (
            singleSelectValues[key] === undefined ||
            singleSelectValues[key] === null ||
            singleSelectValues[key] === 'all'
          ) {
            setSingleSelectValues((prev) => ({
              ...prev,
              [key]: '',
            }));
          }
        }}
        onChange={(value) => handleSingleSelectChange(key, value)}
        onBlur={() => {
          if (singleSelectValues[key] === "") {
            setSingleSelectValues((prev) => ({
              ...prev,
              [key]: 'all',
            }));
          }
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
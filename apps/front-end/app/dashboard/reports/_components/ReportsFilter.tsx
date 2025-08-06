'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Paper, Select, MultiSelect, SimpleGrid } from '@mantine/core';
import { DatePickerInput, DatesRangeValue } from '@mantine/dates';
import dayjs from 'dayjs';
import { IFilterParams, updateUrlParams } from '@/libs/utils/updateUrlParams';
import { IReportFilter, IFilterValue } from '@cricket-analysis-monorepo/interfaces';
import { ReportFilterType } from '@cricket-analysis-monorepo/constants';
import { useState } from 'react';

interface IReportFilters {
  reportFilters: IReportFilter[];
}

const styleThemes = [
  {
    bgColor: 'var(--mantine-color-orange-5)',
    color: 'white',
    selectColor: 'white',
    selectBgColor: 'var(--mantine-color-orange-7)',
  },
  {
    bgColor: 'var(--mantine-color-yellow-6)',
    color: 'black',
    selectColor: 'black',
    selectBgColor: 'var(--mantine-color-yellow-0)',
  },
];

// Type guard to check if a value is IFilterValue
const isFilterValue = (val: unknown): val is IFilterValue =>
  typeof val === 'object' &&
  val !== null &&
  'value' in val &&
  typeof (val as IFilterValue).value === 'string';

// Build label/value options safely and uniquely
const buildOptions = (values: (number | string | IFilterValue)[]) => {
  const seen = new Set<string>();

  return [
    { label: 'All', value: 'all' },
    ...values
      .map((val) => {
        if (isFilterValue(val)) {
          return {
            label: val.label ? String(val.label) : val.value,
            value: val.value,
          };
        }
        return {
          label: String(val),
          value: String(val),
        };
      })
      .filter(({ value }) => {
        if (seen.has(value)) return false;
        seen.add(value);
        return true;
      }),
  ];
};

export const ReportsFilter = ({ reportFilters }: IReportFilters) => {
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
    } else if (!start && !end) {
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
    // If cleared, reset to "all"
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
  const renderFilterField = (
    filter: IReportFilter & {
      bgColor: string;
      color: string;
      selectColor: string;
      selectBgColor: string;
    }
  ) => {
    const key = filter.queryParameterKey ?? filter.label;
    if (filter.type === ReportFilterType.DATE_RANGE) {
      return (
        <DatePickerInput
          type="range"
          label={filter.label}
          defaultValue={
            startDate && endDate ? [new Date(startDate), new Date(endDate)] : undefined
          }
          onChange={handleDateChange}
          placeholder="Select Year Range"
          clearable
          styles={{
            input: {
              background: 'var(--mantine-color-orange-7)',
              color: 'black',
              border: 'none',
            },
            placeholder: { color: 'black' }
          }}
        />
      );
    }

    const options = buildOptions(filter.values);
    const defaultSelectedValues = filter.singleFilterConfig?.selectedValues;
    const param = searchParams.get(key);
    const stateValue = singleSelectValues[key];
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
          styles={{
            input: {
              height: '2.2em',
              background: filter.selectBgColor,
              color: 'black',
              border: 'none',
              overflowX: 'auto',
              overflowY: 'hidden',
            },
            pillsList: {
              flexWrap: 'nowrap',
              height: '1.9em',
            },
            label: {
              color: filter.selectColor,
            },
          }}
        />
      );
    }

    return (
      <Select
        label={filter.label}
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
        styles={{
          input: {
            background: filter.selectBgColor,
            color: 'black',
            border: 'none',
            width: '100%',
          },
          label: {
            color: filter.selectColor,
          },
        }}
      />
    );
  };

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: reportFilters.length > 6 ? 6 : reportFilters.length }}>
      {reportFilters.map((filter, index) => {
        const theme = styleThemes[index % styleThemes.length];
        const styledFilter = { ...filter, ...theme };

        return (
          <Paper
            key={filter.queryParameterKey ?? filter.label}
            bg={styledFilter.bgColor}
            p="xs"
            radius="md"
            withBorder
          >
            {renderFilterField(styledFilter)}
          </Paper>
        );
      })}
    </SimpleGrid>
  );
};
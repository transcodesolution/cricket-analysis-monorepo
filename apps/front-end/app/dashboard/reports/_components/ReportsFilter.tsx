'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Paper, Select, MultiSelect, SimpleGrid } from '@mantine/core';
import { DatePickerInput, DatesRangeValue } from '@mantine/dates';
import dayjs from 'dayjs';
import { IFilterParams, updateUrlParams } from '@/libs/utils/updateUrlParams';
import { IReportFilter, IFilterValue } from '@cricket-analysis-monorepo/interfaces';
import { ReportFilterType } from '@cricket-analysis-monorepo/constants';

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
        />
      );
    }

    const options = buildOptions(filter.values);
    const defaultSelected =
      searchParams.get(key) ?? filter.singleFilterConfig?.selectedPlayer ?? '';

    if (filter.isMultiSelectOption) {
      const values = (searchParams.get(key)?.split(',') ||
        (defaultSelected ? [defaultSelected] : [])) as string[];

      return (
        <MultiSelect
          label={filter.label}
          data={options}
          size="sm"
          searchable
          value={values.length === 0 ? ['all'] : values}
          onChange={(val) => {
            if (val.includes('all') && val.length > 1) {
              const filtered = val.filter((v) => v !== 'all');
              handleApplyFilter({ [key]: filtered.join(',') });
            } else if (val.includes('all')) {
              handleApplyFilter({ [key]: undefined });
            } else {
              handleApplyFilter({ [key]: val.join(',') });
            }
          }}
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
        value={defaultSelected || 'all'}
        onChange={(val) => {
          handleApplyFilter({
            [key]: !val || val === 'all' ? undefined : val,
          });
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
    <SimpleGrid
      cols={{ base: 1, sm: 2, md: reportFilters.length }}
    >
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

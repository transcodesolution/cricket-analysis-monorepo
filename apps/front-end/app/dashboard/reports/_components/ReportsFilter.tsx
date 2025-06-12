'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Flex, Paper, Select, MultiSelect } from '@mantine/core';
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
    bgColor: '#E87722',
    color: '#fff',
    selectColor: '#fff',
    selectBgColor: '#cba181',
  },
  {
    bgColor: '#FDF3C0',
    color: '#222',
    selectColor: '#222',
    selectBgColor: '#F6E7B4',
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
          placeholder={filter.label}
          data={options}
          size="sm"
          searchable
          value={values}
          onChange={(val) => {
            handleApplyFilter({
              [key]: val.length === 0 || val.includes('all') ? undefined : val.join(','),
            });
          }}
          maw={370}
          styles={{
            input: {
              height: '2.2em',
              background: filter.selectBgColor,
              color: filter.selectColor,
              border: 'none',
              width: '370px',
              overflowX: 'auto',
              overflowY: 'hidden',
            },
            pillsList: {
              flexWrap: 'nowrap',
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
        placeholder={filter.label}
        data={options}
        size="sm"
        searchable
        clearable
        value={defaultSelected === 'all' ? null : defaultSelected}
        onChange={(val) => {
          handleApplyFilter({
            [key]: !val || val === 'all' ? undefined : val,
          });
        }}
        styles={{
          input: {
            background: filter.selectBgColor,
            color: filter.selectColor,
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
    <Flex gap="sm" wrap={{ md: 'nowrap', base: 'wrap' }}>
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
            w='100%'
          >
            {renderFilterField(styledFilter)}
          </Paper>
        );
      })}
    </Flex>
  );
};

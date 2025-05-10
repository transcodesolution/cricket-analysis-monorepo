import { useRouter, useSearchParams } from 'next/navigation';
import { Flex, Paper, Select, MultiSelect } from '@mantine/core';
import { DatePickerInput, DatesRangeValue } from '@mantine/dates';
import { useMemo, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { IFilterParams, updateUrlParams } from '@/libs/utils/updateUrlParams';
import { IReportFilters } from '@/libs/types-api/src';

interface IReportFilter {
  filters: IReportFilters[];
}

export const ReportFilter = ({ filters }: IReportFilter) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dateRange, setDateRange] = useState<DatesRangeValue>([null, null]);

  // Sync dateRange with URL parameters
  useEffect(() => {
    const start = searchParams.get('startDate');
    const end = searchParams.get('endDate');
    if (start && end) {
      setDateRange([new Date(start), new Date(end)]);
    }
  }, [searchParams]);

  const parsedFilters = useMemo(() => {
    return filters.map((filter) => {
      const { label, type, values = [], queryParameterKey, isMultiSelectOption } = filter;

      if (type === 'date-range') {
        return {
          type: 'date-range' as const,
          label,
          key: queryParameterKey ?? 'dateRange',
        };
      }

      const filterData = [
        { value: 'all', label: 'All' },
        ...values
          .filter((val) => val?.value && val?.label)
          .map((val) => ({
            value: String(val.value),
            label: String(val.label),
          })),
      ];

      return {
        label,
        key: queryParameterKey ?? label,
        data: filterData,
        isMultiSelect: isMultiSelectOption ?? false,
      };
    });
  }, [filters]);

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

  return (
    <Flex gap="sm" wrap="wrap">
      {parsedFilters.map((cfg) => (
        <Paper
          key={cfg.key}
          bg="var(--mantine-color-gray-1)"
          p="xs"
          radius="md"
          withBorder
          miw={220}
        >
          {'type' in cfg && cfg.type === 'date-range' ? (
            <DatePickerInput
              type="range"
              label={cfg.label}
              value={dateRange}
              onChange={handleDateChange}
              placeholder="Select Year Range"
            />
          ) : cfg.isMultiSelect ? (
            <MultiSelect
              label={cfg.label}
              placeholder={cfg.label}
              data={cfg.data}
              size="sm"
              value={(searchParams.get(cfg.key)?.split(',') || []) as string[]}
              onChange={(values) => {
                handleApplyFilter({
                  [cfg.key]: values.length === 0 || values.includes('all') ? undefined : values.join(','),
                });
              }}
              max={207}

              styles={{
                input: {
                  height: '2.2em',
                  width: '207px',
                  overflowX: "auto",
                  overflowY: "hidden",
                },
                pillsList: {
                  flexWrap: 'nowrap'
                }
              }}
            />
          ) : (
            <Select
              label={cfg.label}
              placeholder={cfg.label}
              data={cfg.data}
              size="sm"
              clearable
              value={searchParams.get(cfg.key) || null}
              onChange={(value) => {
                handleApplyFilter({
                  [cfg.key]: !value || value === 'all' ? undefined : value,
                });
              }}
            />
          )}
        </Paper>
      ))}
    </Flex>
  );
};

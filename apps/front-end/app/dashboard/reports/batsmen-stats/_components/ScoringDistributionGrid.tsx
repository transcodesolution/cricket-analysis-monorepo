import { IScoringDistribution } from '@/libs/types-api/src';
import { Flex, Paper, Text } from '@mantine/core';

interface IScoringDistributionGridData {
  title?: string;
  data: IScoringDistribution;
};

const pairedKeys: [string, string][] = [
  ['0+', '0-9'],
  ['10+', '10-19'],
  ['20+', '20-29'],
  ['30+', '30-39'],
  ['40+', '40-49'],
  ['50+', '50-59'],
  ['60+', '60-69'],
  ['70+', '70-79'],
  ['80+', '80-89'],
  ['90+', '90-99'],
  ['100+', '100-109'],
  ['110+', '110-119'],
  ['120+', '120-129'],
];

export const ScoringDistributionGrid = ({ title, data }: IScoringDistributionGridData) => {
  return (
    <div>
      {title && (
        <Paper
          p="xs"
          radius={0}
          withBorder
          my="sm"
          styles={{
            root: {
              backgroundColor: 'var(--mantine-color-gray-9)',
              color: 'white',
              textAlign: 'center',
              fontWeight: 600,
              fontSize: 18,
            },
          }}
        >
          {title}
        </Paper>
      )}

      <Flex
        gap={0}
        wrap="nowrap"
        direction="row"
        styles={{
          root: { minWidth: '100%', overflowX: 'auto' },
        }}
      >
        {pairedKeys.map(([mainKey, subKey], idx) => {
          const isEven = idx % 2 === 0;
          const backgroundColor = isEven ? 'var(--mantine-color-lightBlue-0)' : 'var(--mantine-color-lightBlue-1)';

          const mainValue = data[mainKey];
          const subValue = data[subKey];

          // Skip if both are undefined/null
          if (mainValue == null && subValue == null) return null;

          return (
            <Paper
              key={mainKey}
              p="xs"
              radius={0}
              withBorder
              styles={{
                root: {
                  backgroundColor,
                  color: 'black',
                  border: '1px solid var(--mantine-color-gray-5)',
                  minWidth: 100,
                  flex: '1 0 100px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  flexShrink: 0,
                },
              }}
            >
              {mainValue !== undefined && (
                <>
                  <Text fw={600} fz="md">{mainKey}</Text>
                  <Text fz="md">{mainValue}%</Text>
                </>
              )}
              {subValue !== undefined && (
                <>
                  <Text fw={600} fz="md">{subKey}</Text>
                  <Text fz="md">{subValue}%</Text>
                </>
              )}
            </Paper>
          );
        })}
      </Flex>
    </div>
  );
};

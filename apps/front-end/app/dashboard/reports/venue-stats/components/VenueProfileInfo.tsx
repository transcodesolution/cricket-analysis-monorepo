import { IVenueProfile } from '@/libs/types-api/src';
import { Text, Title, Stack, Flex } from '@mantine/core';

interface IVenueProfileInfo {
  VenueProfile: IVenueProfile[];
}

export const VenueProfileInfo = ({ VenueProfile }: IVenueProfileInfo) => {
  return (
    <Stack>
      {VenueProfile?.map((venue, idx) => (
        <Flex key={idx} align="center" gap="lg">
          <Title order={3} fw={600}>
            {venue.name}
          </Title>
          <Text size="lg">
            (Inns: <Text span fw={500}>{venue.innings}</Text>)
          </Text>
        </Flex>
      ))}
    </Stack>
  );
};
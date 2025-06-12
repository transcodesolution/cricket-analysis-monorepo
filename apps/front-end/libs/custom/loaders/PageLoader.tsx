import { Loader, Center, Box } from '@mantine/core';

interface IPageLoader {
  height?: string | number;
}

const PageLoader = ({ height = 'calc(100vh - 96px)' }: IPageLoader) => {
  return (
    <Box w="100%" h={height}>
      <Center h="100%">
        <Loader />
      </Center>
    </Box>
  );
};

export default PageLoader;
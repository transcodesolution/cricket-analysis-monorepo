import { Stack, Title } from "@mantine/core";
import { UploadFile } from "./_components/UploadFile";

export default function Page() {
  return <Stack>
    <Title order={2} fw={600}>Upload</Title>
    <UploadFile />
  </Stack>
}
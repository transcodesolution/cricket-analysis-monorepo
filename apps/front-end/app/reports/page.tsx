import { Stack, Title } from "@mantine/core";
import { ReportList } from "./_components/ReportList";

export default function Page() {
  return <Stack>
    <Title order={2} fw={600}>Reports</Title>
    <ReportList />
  </Stack>
}
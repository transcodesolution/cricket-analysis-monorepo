import { Stack, Title } from "@mantine/core";
import { AIAnalysisPage } from "./_components/AIAnalysisPage";

export default function Page() {
  return <Stack>
    <Title order={2} fw={600}>AI Analysis</Title>
    <AIAnalysisPage />
  </Stack>
}
import { Stack } from "@mantine/core";
import BackToOverview from "@/libs/custom/back-to-overview";
import TeamPerformanceReport from "./components/TeamPerformanceReport";

export default function Page() {
  return (
    <Stack>
      <BackToOverview title="Reports" backUrl='/dashboard/reports' />
      <TeamPerformanceReport />
    </Stack>
  );
}
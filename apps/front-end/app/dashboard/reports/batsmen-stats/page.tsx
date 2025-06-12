import { Stack } from "@mantine/core";
import BackToOverview from "@/libs/custom/back-to-overview";
import { BatsmanStatsReport } from "./_components/BatsmanStatsReport";

export default function Page() {
  return (
    <Stack>
      <BackToOverview title="Reports" backUrl='/dashboard/reports' />
      <BatsmanStatsReport />
    </Stack>
  )
}
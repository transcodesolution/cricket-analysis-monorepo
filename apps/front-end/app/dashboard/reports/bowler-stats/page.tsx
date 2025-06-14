import { Stack } from "@mantine/core";
import BackToOverview from "@/libs/custom/back-to-overview";
import { BowlerStatsReport } from "./_components/BowlerStatsReport";

export default function Page() {
  return (
    <Stack>
      <BackToOverview title="Reports" backUrl='/dashboard/reports' />
      <BowlerStatsReport />
    </Stack>
  )
}
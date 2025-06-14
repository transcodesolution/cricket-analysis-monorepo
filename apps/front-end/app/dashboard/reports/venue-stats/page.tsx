import { Stack } from "@mantine/core";
import BackToOverview from "@/libs/custom/back-to-overview";
import { VenueStatsReport } from "./components/VenueStatsReport";

export default function Page() {
  return (
    <Stack>
      <BackToOverview title="Reports" backUrl='/dashboard/reports' />
      <VenueStatsReport />
    </Stack>
  )
}
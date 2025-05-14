import { Stack } from "@mantine/core";
import { ReportTable } from "./_components/ReportTable";
import BackToOverview from "@/libs/custom/back-to-overview";

export default function Page() {
  return <Stack>
    <BackToOverview title="Reports" backUrl='/dashboard/reports' />
    <ReportTable />
  </Stack>
}
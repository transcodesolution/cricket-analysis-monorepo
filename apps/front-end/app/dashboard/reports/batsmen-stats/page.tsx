import { Stack } from "@mantine/core";
import BackToOverview from "@/libs/custom/back-to-overview";
import { BatsmenPage } from "./_components/BatsmenPage";

export default function Page() {
  return (
    <Stack>
      <BackToOverview title="Reports" backUrl='/dashboard/reports' />
      <BatsmenPage />
    </Stack>
  )
}
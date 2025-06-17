"use client";
import { useRouter } from "next/navigation";
import { Anchor, Flex, Title } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";

interface IBackToOverview {
  title?: string;
  backUrl?: string;
}

export const BackToOverview = ({ title = "Back", backUrl }: IBackToOverview) => {
  const router = useRouter();

  const handleBack = (event: React.MouseEvent) => {
    event.preventDefault();
    backUrl ? router.push(backUrl) : router.back();
  };

  return (
    <Anchor onClick={handleBack} c="var(--mantine-color-gray-8)" underline='never' display='flex' styles={{ root: { alignItems: 'center', gap: '4px' } }} w='fit-content'>
      <IconChevronLeft size={24} />
      <Title order={3} fw={600}>{title}</Title>
    </Anchor>
  );
}

export default BackToOverview;

import { Paper, Stack, Text, Title } from "@mantine/core";

type ShiftSettingsProps = {
}

const ShiftSettings = (props: ShiftSettingsProps) => {
  return (
    <Paper
      id="shift"
      data-section-id="shift"
      p="lg"
    >
      <Stack>
        <Title order={3}>Shift Settings</Title>
        <Text>
          Configure settings related to shifts, including scheduling and availability.
        </Text>
        {/* Add shift settings content here */}
      </Stack>
    </Paper>
  );
};

export { ShiftSettings };
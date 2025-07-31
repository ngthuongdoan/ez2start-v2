import { Paper, Stack, Text, Title } from "@mantine/core";

type PositionSettingsProps = {
}

const PositionSettings = (props: PositionSettingsProps) => {
  return (
    <Paper
      id="position"
      data-section-id="position"
      p="lg"
    >
      <Stack>
        <Title order={3}>Position Settings</Title>
        <Text>
          Configure settings related to user positions and roles within the application.
        </Text>
        {/* Add position settings content here */}
      </Stack>
    </Paper>
  );
};

export { PositionSettings };
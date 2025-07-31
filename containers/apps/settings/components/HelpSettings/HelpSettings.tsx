import { Paper, Stack, Text, Title } from "@mantine/core";

type HelpSettingsProps = {

}

const HelpSettings = (props: HelpSettingsProps) => {
  return (
    <Paper
      id="help"
      data-section-id="help"
      p="lg"
    >
      <Stack>
        <Title order={3}>Help & Documentation</Title>
        <Text>
          Find answers to common questions and learn how to use the system.
        </Text>
        {/* Add help content here */}
      </Stack>
    </Paper>
  );
};

export { HelpSettings };
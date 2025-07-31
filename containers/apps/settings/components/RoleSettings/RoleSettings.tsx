import { Paper, Stack, Text, Title } from "@mantine/core";

type RoleSettingsProps = {
}

const RoleSettings = (props: RoleSettingsProps) => {
  return (
    <Paper
      id="role"
      data-section-id="role"
      p="lg"
    >
      <Stack>
        <Title order={3}>Role Settings</Title>
        <Text>
          Configure user roles and permissions within the application.
        </Text>
        {/* Add role settings content here */}
      </Stack>
    </Paper>
  );
};

export { RoleSettings };
import { ActionIcon, Badge, Button, Card, Grid, Group, Paper, PaperProps, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { Role, RoleDetailModal } from "./RoleDetailModal";
import { modals } from "@mantine/modals";

type RoleSettingsProps = {
} & PaperProps;

// Default roles with permissions info
const MOCK_ROLE: Role[] = [
  {
    id: "admin",
    name: "ADMIN",
    startTime: "00:00",
    endTime: "23:59",
    canDelete: true,
    disabledRoutes: []
  },
  {
    id: "moderator",
    name: "MODERATOR",
    startTime: "00:00",
    endTime: "23:59",
    canDelete: false,
    disabledRoutes: ["/settings/advanced", "/apps/employee/delete"]
  }
];

export const RoleSettings = (props: RoleSettingsProps) => {
  const [roles, setRoles] = useState<Role[]>(MOCK_ROLE);
  const [modalOpened, { open, close }] = useDisclosure()
  const [editingRole, setEditingRole] = useState<Role | undefined>();

  const handleCreateRole = () => {
    setEditingRole(undefined);
    open()
  };

  const handleEditRole = (id: string) => {
    const role = roles.find(s => s.id === id);
    if (role) {
      setEditingRole(role);
      open();
    }
  };

  const handleDeleteRole = (id: string) => {
    // Don't allow deletion of default roles
    if (id === "admin" || id === "moderator") {
      modals.openConfirmModal({
        title: "Cannot Delete Default Role",
        centered: true,
        children: (
          <Text size="sm">
            Default roles (ADMIN and MODERATOR) cannot be deleted from the system.
          </Text>
        ),
        labels: { confirm: "OK", cancel: "" },
      });
      return;
    }

    modals.openConfirmModal({
      title: "Delete Role",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this role? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => setRoles(roles.filter(role => role.id !== id))
    });
  };

  const handleSubmitRole = (role: Role) => {
    if (editingRole) {
      setRoles(roles.map(r => r.id === role.id ? role : r));
    } else {
      setRoles([...roles, role]);
    }
  };

  return (
    <Paper
      id="role"
      data-section-id="role"
      p="lg"
      {...props}
    >
      <Stack gap="md">
        <Group justify="space-between">
          <Stack gap={4}>
            <Title order={3}>Role Settings</Title>
            <Text size="sm" c="dimmed">
              Configure user roles and permissions within the application.
            </Text>
          </Stack>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={handleCreateRole}
          >
            Create Role
          </Button>
        </Group>

        <Grid>
          {roles.map((role) => (
            <Grid.Col key={role.id} span={{ sm: 6, md: 4, xs: 12 }}>
              <Card withBorder shadow="sm" p="md">
                <Group justify="between" mb="xs">
                  <Group>
                    <Text fw={500}>{role.name}</Text>
                    {(role.id === "admin" || role.id === "moderator") && (
                      <Badge color="blue" variant="light">Default</Badge>
                    )}
                  </Group>
                  <Group gap={8}>
                    <ActionIcon
                      color="blue"
                      variant="light"
                      onClick={() => handleEditRole(role.id)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      color="red"
                      variant="light"
                      onClick={() => handleDeleteRole(role.id)}
                      disabled={role.id === "admin" || role.id === "moderator"}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Group>
                <Text size="sm" c="dimmed">
                  Can delete: {role.canDelete ? "Yes" : "No"}
                </Text>
                {role.disabledRoutes && role.disabledRoutes.length > 0 && (
                  <Text size="sm" c="dimmed">
                    Restricted routes: {role.disabledRoutes.length}
                  </Text>
                )}
              </Card>
            </Grid.Col>
          ))}
        </Grid>
        <RoleDetailModal
          opened={modalOpened}
          onClose={() => {
            close();
            setEditingRole(undefined);
          }}
          onSubmit={handleSubmitRole}
          initialValues={editingRole}
        />
      </Stack>
    </Paper>
  );
}
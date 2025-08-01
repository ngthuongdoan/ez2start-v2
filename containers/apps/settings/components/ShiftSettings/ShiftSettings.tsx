import { ActionIcon, Button, Card, Grid, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { ShiftDetailModal, Shift } from "./ShiftDetailModal";
import { modals } from "@mantine/modals";
import { useDisclosure } from "@mantine/hooks";
import { TimeValue } from "@mantine/dates";

type ShiftSettingsProps = {
}

const MOCK_SHIFTS: Shift[] = [
  {
    id: "1",
    name: "Morning Shift",
    startTime: "08:00",
    endTime: "16:00"
  },
  {
    id: "2",
    name: "Evening Shift",
    startTime: "16:00",
    endTime: "00:00"
  }
];

const ShiftSettings = (props: ShiftSettingsProps) => {
  const [shifts, setShifts] = useState<Shift[]>(MOCK_SHIFTS);
  const [modalOpened, { open, close }] = useDisclosure()
  const [editingShift, setEditingShift] = useState<Shift | undefined>();

  const handleCreateShift = () => {
    setEditingShift(undefined);
    open()
  };

  const handleEditShift = (id: string) => {
    const shift = shifts.find(s => s.id === id);
    if (shift) {
      setEditingShift(shift);
      open();
    }
  };

  const handleDeleteShift = (id: string) => {
    modals.openConfirmModal({
      title: "Delete Shift",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this shift? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => setShifts(shifts.filter(shift => shift.id !== id))
    });
  };

  const handleSubmitShift = (shift: Shift) => {
    if (editingShift) {
      setShifts(shifts.map(s => s.id === shift.id ? shift : s));
    } else {
      setShifts([...shifts, shift]);
    }
  };

  return (
    <Paper
      id="shift"
      data-section-id="shift"
      p="lg"
    >
      <Stack gap="md">
        <Group justify="space-between">
          <Stack gap={4}>
            <Title order={3}>Shift Settings</Title>
            <Text size="sm" c="dimmed">
              Configure settings related to shifts, including scheduling and availability.
            </Text>
          </Stack>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={handleCreateShift}
          >
            Create Shift
          </Button>
        </Group>

        <Grid>
          {shifts.map((shift) => (
            <Grid.Col key={shift.id} span={{ sm: 6, md: 4, xs: 12 }}>
              <Card withBorder shadow="sm" p="md">
                <Group justify="between" mb="xs">
                  <Text fw={500}>{shift.name}</Text>
                  <Group gap={8}>
                    <ActionIcon
                      color="blue"
                      variant="light"
                      onClick={() => handleEditShift(shift.id)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      color="red"
                      variant="light"
                      onClick={() => handleDeleteShift(shift.id)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Group>
                <Text size="sm" c="dimmed">
                  <TimeValue value={shift.startTime} format="12h" /> - <TimeValue value={shift.endTime} format="12h" />
                </Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
        <ShiftDetailModal
          opened={modalOpened}
          onClose={() => {
            close();
            setEditingShift(undefined);
          }}
          onSubmit={handleSubmitShift}
          initialValues={editingShift}
        />
      </Stack>
    </Paper>
  );
}
export { ShiftSettings };
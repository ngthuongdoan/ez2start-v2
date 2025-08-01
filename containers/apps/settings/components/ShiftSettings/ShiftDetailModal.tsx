import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { TimeInput, TimePicker } from "@mantine/dates"
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { useEffect } from "react";

export type Shift = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
};

type ShiftDetailModalProps = {
  opened: boolean;
  onClose: () => void;
  onSubmit: (shift: Shift) => void;
  initialValues?: Shift;
};

export const ShiftDetailModal = ({
  opened,
  onClose,
  onSubmit,
  initialValues,
}: ShiftDetailModalProps) => {
  const form = useForm<Shift>({
    initialValues: {
      id: randomId(),
      name: "",
      startTime: "09:00",
      endTime: "17:00",
    },
    validate: {
      name: (value) => (!value ? "Name is required" : null),
      startTime: (value, values) => {
        if (!value) return "Start time is required";
        if (value >= values.endTime) return "Start time must be before end time";
        return null;
      },
      endTime: (value, values) => {
        if (!value) return "End time is required";
        if (value <= values.startTime) return "End time must be after start time";
        return null;
      },
    },
  });

  useEffect(() => {
    if (opened) {
      if (initialValues) {
        form.setValues(initialValues);
      } else {
        form.setValues({
          id: randomId(),
          name: "",
          startTime: "09:00",
          endTime: "17:00",
        });
      }
    }
  }, [opened, initialValues]);

  const handleSubmit = (values: Shift) => {
    onSubmit(values);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={initialValues ? "Edit Shift" : "Create New Shift"}
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Shift Name"
            placeholder="Enter shift name"
            required
            {...form.getInputProps("name")}
          />

          <TimePicker
            label="Start Time"
            placeholder="Select start time"
            required
            {...form.getInputProps("startTime")}
          />

          <TimePicker
            label="End Time"
            placeholder="Select end time"
            required
            {...form.getInputProps("endTime")}
          />

          <Group justify="flex-end">
            <Button variant="light" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialValues ? "Save Changes" : "Create Shift"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

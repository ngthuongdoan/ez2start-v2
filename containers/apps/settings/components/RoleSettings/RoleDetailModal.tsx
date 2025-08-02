import { Button, Checkbox, Group, Modal, MultiSelect, Stack, Switch, TextInput } from "@mantine/core";
import { TimePicker } from "@mantine/dates"
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { useEffect } from "react";

export type Role = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  canDelete: boolean;
  disabledRoutes: string[];
};

type RoleDetailModalProps = {
  opened: boolean;
  onClose: () => void;
  onSubmit: (role: Role) => void;
  initialValues?: Role;
};

// List of routes that can be restricted
const AVAILABLE_ROUTES = [
  { value: "/settings/advanced", label: "Advanced Settings" },
  { value: "/apps/employee/delete", label: "Delete Employees" },
  { value: "/apps/settings/delete", label: "Delete Settings" },
  { value: "/apps/reports", label: "View Reports" },
  { value: "/apps/analytics", label: "View Analytics" },
  { value: "/apps/billing", label: "Billing Management" },
];

export const RoleDetailModal = ({
  opened,
  onClose,
  onSubmit,
  initialValues,
}: RoleDetailModalProps) => {
  const form = useForm<Role>({
    initialValues: {
      id: randomId(),
      name: "",
      startTime: "09:00",
      endTime: "17:00",
      canDelete: false,
      disabledRoutes: [],
    },
    validate: {
      name: (value) => (!value ? "Role name is required" : null),
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

  // Check if we're editing a default role (Admin or Moderator)
  const isDefaultRole = initialValues && (initialValues.id === "admin" || initialValues.id === "moderator");

  useEffect(() => {
    if (opened) {
      if (initialValues) {
        form.setValues(initialValues);
      } else {
        form.setValues({
          id: randomId(),
          name: "",
          canDelete: false,
          disabledRoutes: [],
        });
      }
    }
  }, [opened, initialValues]);

  const handleSubmit = (values: Role) => {
    onSubmit(values);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={initialValues ? "Edit Role" : "Create New Role"}
      size="md"
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Role Name"
            placeholder="Enter role name"
            required
            disabled={isDefaultRole} // Disable name editing for default roles
            {...form.getInputProps("name")}
          />

          <Switch
            label="Can delete content"
            description="Allow users with this role to delete content"
            checked={form.values.canDelete}
            onChange={(event) => form.setFieldValue('canDelete', event.currentTarget.checked)}
            disabled={isDefaultRole && initialValues?.id === "admin"} // Admin must always have delete rights
          />

          <MultiSelect
            label="Restricted Routes"
            description="Select routes that will be disabled for this role"
            placeholder="Select routes"
            data={AVAILABLE_ROUTES}
            disabled={isDefaultRole && initialValues?.id === "admin"} // Admin must have access to all routes
            {...form.getInputProps("disabledRoutes")}
          />

          <Group justify="flex-end">
            <Button variant="light" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialValues ? "Save Changes" : "Create Role"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

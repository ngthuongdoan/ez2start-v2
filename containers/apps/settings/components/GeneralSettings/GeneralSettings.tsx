'use client';
import { ImageUploader } from "@/components/ImageUploader/ImageUploader";
import { Button, ColorInput, ComboboxData, Grid, Group, noop, Paper, Select, Stack, TextInput, Title, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
const COMPANY_SIZE_OPTIONS: ComboboxData = [
  {
    label: "Small (1-50 employees)",
    value: "small",
  },
  {
    label: "Medium (51-200 employees)",
    value: "medium",
  },
  {
    label: "Large (201+ employees)",
    value: "large",
  }
];

const LANGUAGE_OPTIONS: ComboboxData = [
  {
    label: "English",
    value: "en",
  },
  {
    label: "Vietnam",
    value: "vi",
  }
];

const THEME_OPTIONS: ComboboxData = [
  {
    label: "Light",
    value: "light",
  },
  {
    label: "Dark",
    value: "dark",
  }
];
type GeneralSettingsProps = {
}

const GeneralSettings = (props: GeneralSettingsProps) => {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const form = useForm({
    initialValues: {
      theme: colorScheme, // false: Light, true: Dark
      businessName: "",
      language: "",
      themeColor: theme.primaryColor,
      logo: null as File | null,
      companySize: "",
      licenseKey: "1234-5678-ABCD-EFGH",
    },
  });

  const handleSave = (values: typeof form.values) => {
    // Handle save logic here
    console.log(values);
  };

  const handleCancel = () => {
    form.reset();
  };

  return (
    <Paper
      id="general"
      data-section-id="general"
      p="lg"
    >
      <Stack>
        <Title order={3}>General Settings</Title>
        <form onSubmit={form.onSubmit(handleSave)}>
          <Stack>
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Business Name"
                  placeholder="Enter your business name"
                  {...form.getInputProps("businessName")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Company Size"
                  placeholder="Select company size"
                  data={COMPANY_SIZE_OPTIONS}
                  {...form.getInputProps("companySize")}
                />
              </Grid.Col>
              <Grid.Col span={8}>
                <Grid>
                  <Grid.Col span={4}>
                    <Select
                      label="Language"
                      placeholder="Select a language"
                      data={LANGUAGE_OPTIONS}
                      {...form.getInputProps("language")}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <ColorInput
                      label="Theme Color"
                      {...form.getInputProps("themeColor")}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Select
                      label="Theme"
                      data={THEME_OPTIONS}
                      {...form.getInputProps("theme")}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <TextInput
                      label="License Key"
                      value={form.values.licenseKey}
                      disabled
                    />
                  </Grid.Col>
                </Grid>
              </Grid.Col>

              <Grid.Col span={4}>
                <ImageUploader
                  imageUrl={form.values.logo ? URL.createObjectURL(form.values.logo) : undefined}
                  folder="logos"
                  width={200}
                  height={100}
                  radius="sm"
                  title="Upload company logo"
                  description="Recommended size: 200x100px, PNG format"
                  onUploadSuccess={noop}
                />
              </Grid.Col>
            </Grid>


            <Group justify="end" mt="md">
              <Button variant="default" onClick={handleCancel}>Cancel</Button>
              <Button type="submit">Save</Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
};

export { GeneralSettings };

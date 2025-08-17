'use client';
import { ImageUploader } from "@/components/ImageUploader/ImageUploader";
import { UploadPreset } from "@/lib/cloudinary";
import { Button, ColorInput, ComboboxData, getThemeColor, Grid, Group, noop, Paper, parseThemeColor, Select, Stack, TextInput, Title, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { BusinessData } from "@/types/db"
import { randomId } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
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

const TIME_DISPLAY_OPTIONS: ComboboxData = [
  {
    label: "12-hour format",
    value: "12h",
  },
  {
    label: "24-hour format",
    value: "24h",
  }
];
type GeneralSettingsProps = {
}

const GeneralSettings = (props: GeneralSettingsProps) => {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const parsedColor = parseThemeColor({ color: theme.primaryColor, theme });

  const form = useForm({
    initialValues: {
      theme: colorScheme, // false: Light, true: Dark
      businessName: "",
      language: "",
      themeColor: parsedColor.value,
      logo: null as File | null,
      companySize: "",
      licenseKey: "1234-5678-ABCD-EFGH",
      timeDisplay: "24h",
    },
  });

  const handleSave = (values: typeof form.values) => {
    // Handle save logic here
    console.log(values);
  };

  const handleCancel = () => {
    form.reset();
  };

  const initData = async () => {
    const body = {
      businessId: randomId("business-id"),
      ownerUid: randomId("owner-uid"),
      businessData: {
        business_name: form.values.companySize,
        business_type: "f&b",
      } as BusinessData
    }
    const response = await axios.post("/api/onboarding", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    console.log("🚀 ----------------------------------🚀")
    console.log("🚀 ~ initData ~ response:", response)
    console.log("🚀 ----------------------------------🚀")
    notifications.show({
      color: "green",
      message: "Init business done"
    })
  }
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
                  <Grid.Col span={6}>
                    <TextInput
                      label="License Key"
                      {...form.getInputProps("licenseKey")}
                      disabled
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Select
                      label="Time display"
                      data={TIME_DISPLAY_OPTIONS}
                      {...form.getInputProps("timeDisplay")}
                    />
                  </Grid.Col>
                </Grid>
              </Grid.Col>

              <Grid.Col span={4}>
                <ImageUploader
                  preset={UploadPreset.Logo}
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


            <Group justify="space-between" mt="md">
              <Button variant="subtle" onClick={initData} type="button" color="gray">Create Data</Button>
            <Group justify="end" mt="md">
              <Button variant="default" onClick={handleCancel}>Cancel</Button>
              <Button type="submit">Save</Button>
            </Group>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
};

export { GeneralSettings };

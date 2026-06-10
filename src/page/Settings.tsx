import { Button, Card, Divider, Group, PasswordInput, Select, SimpleGrid, Stack, Text, TextInput, Title } from "@mantine/core";
import { useState } from "react";
import { useAuth } from "../hook/useAuth";

export default function Settings() {
  const { role } = useAuth();
  const [currency, setCurrency] = useState<string | null>("USD");
  const [period, setPeriod] = useState<string | null>("Monthly");

  return (
    <Stack gap="md">
      <Title order={3}>Settings</Title>

      {/* Profile */}
      <Card withBorder radius="md" padding="md">
        <Group justify="space-between" mb="md">
          <Text fw={500}>Profile</Text>
          <Button variant="subtle" size="xs">Edit</Button>
        </Group>
        <Divider mb="md" />
        <Stack gap="sm">
          <SimpleGrid cols={2}>
            <TextInput label="First name" value="Kiki" readOnly />
            <TextInput label="Last name" value="—" readOnly />
          </SimpleGrid>
          <TextInput label="Email" value="bgcdeveloper3@gmail.com" readOnly />
          <TextInput label="Role" value={role} readOnly />
        </Stack>
      </Card>

      {/* Security */}
      <Card withBorder radius="md" padding="md">
        <Text fw={500} mb="md">Security</Text>
        <Divider mb="md" />
        <Stack gap="sm">
          <PasswordInput label="Password" value="password123" readOnly />
          <Button variant="outline" w="fit-content">Change password</Button>
        </Stack>
      </Card>

      {/* Preferences */}
      <Card withBorder radius="md" padding="md">
        <Text fw={500} mb="md">Preferences</Text>
        <Divider mb="md" />
        <SimpleGrid cols={2}>
          <Select
            label="Currency"
            value={currency}
            onChange={setCurrency}
            data={["USD", "EUR", "GBP"]}
          />
          <Select
            label="Budget period"
            value={period}
            onChange={setPeriod}
            data={["Monthly", "Weekly"]}
          />
        </SimpleGrid>
      </Card>
    </Stack>
  );
}

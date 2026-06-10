import { Badge, Button, Card, Group, Progress, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { BUDGET_CATEGORIES, TOTAL_BUDGET, TOTAL_SPENT } from "../mock/finance";

export default function Budget() {
  const remaining = TOTAL_BUDGET - TOTAL_SPENT;
  const pctUsed = Math.round((TOTAL_SPENT / TOTAL_BUDGET) * 100);

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Title order={3}>Budget</Title>
        <Button variant="outline">Edit limits</Button>
      </Group>

      {/* Summary */}
      <SimpleGrid cols={2}>
        <Card withBorder radius="md" padding="md">
          <Text size="xs" c="dimmed">Total budget</Text>
          <Text size="xl" fw={500}>${TOTAL_BUDGET.toLocaleString()}</Text>
          <Text size="xs" c="dimmed">June 2026</Text>
        </Card>
        <Card withBorder radius="md" padding="md">
          <Text size="xs" c="dimmed">Spent so far</Text>
          <Text size="xl" fw={500}>${TOTAL_SPENT.toLocaleString()}</Text>
          <Text size="xs" c="red">{pctUsed}% used · ${remaining} left</Text>
        </Card>
      </SimpleGrid>

      {/* Category breakdown */}
      <Card withBorder radius="md" padding="md">
        <Text fw={500} mb="md">Category breakdown</Text>
        <Stack gap="md">
          {BUDGET_CATEGORIES.map((b) => {
            const pct = Math.min(Math.round((b.spent / b.limit) * 100), 100);
            const over = b.spent > b.limit;

            return (
              <div key={b.category}>
                <Group justify="space-between" mb={6}>
                  <Text size="sm" fw={500}>{b.category}</Text>
                  <Group gap="sm">
                    <Text size="sm" c="dimmed">${b.spent} / ${b.limit}</Text>
                    <Badge color={over ? "red" : "green"} variant="light" size="sm">
                      {over ? "Over budget" : "On track"}
                    </Badge>
                  </Group>
                </Group>
                <Progress
                  value={pct}
                  color={over ? "red" : "green"}
                  size="sm"
                  radius="xl"
                />
              </div>
            );
          })}
        </Stack>
      </Card>
    </Stack>
  );
}

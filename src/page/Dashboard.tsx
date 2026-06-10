import {
  Card,
  Divider,
  Group,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  CATEGORY_BREAKDOWN,
  TOTAL_BUDGET,
  TOTAL_INCOME,
  TOTAL_SPENT,
  TRANSACTIONS,
  WEEKLY_SPENDING,
} from "../mock/finance";

export default function Dashboard() {
  const remaining = TOTAL_BUDGET - TOTAL_SPENT;
  const txCount = TRANSACTIONS.length;
  const recent = TRANSACTIONS.slice(0, 4);
  const maxWeekly = Math.max(...WEEKLY_SPENDING.map((d) => d.amount));

  return (
    <Stack gap="md">
      <Title order={3}>Dashboard</Title>

      {/* Metric cards */}
      <SimpleGrid cols={4}>
        <Card withBorder radius="md" padding="md">
          <Text size="xs" c="dimmed">
            Total spent
          </Text>
          <Text size="xl" fw={500}>
            ${TOTAL_SPENT.toLocaleString()}
          </Text>
          <Text size="xs" c="red">
            +8% vs last month
          </Text>
        </Card>
        <Card withBorder radius="md" padding="md">
          <Text size="xs" c="dimmed">
            Remaining
          </Text>
          <Text size="xl" fw={500}>
            ${remaining.toLocaleString()}
          </Text>
          <Text size="xs" c="dimmed">
            of ${TOTAL_BUDGET.toLocaleString()} budget
          </Text>
        </Card>
        <Card withBorder radius="md" padding="md">
          <Text size="xs" c="dimmed">
            Transactions
          </Text>
          <Text size="xl" fw={500}>
            {txCount}
          </Text>
          <Text size="xs" c="dimmed">
            this month
          </Text>
        </Card>
        <Card withBorder radius="md" padding="md">
          <Text size="xs" c="dimmed">
            Income
          </Text>
          <Text size="xl" fw={500}>
            ${TOTAL_INCOME.toLocaleString()}
          </Text>
          <Text size="xs" c="green">
            Received Jun 1
          </Text>
        </Card>
      </SimpleGrid>

      <SimpleGrid cols={2}>
        {/* Weekly spending bars */}
        <Card withBorder radius="md" padding="md">
          <Text fw={500} mb="sm">
            Spending this week
          </Text>
          <Group align="flex-end" gap="xs" h={60}>
            {WEEKLY_SPENDING.map((d) => (
              <Stack key={d.day} align="center" gap={4} style={{ flex: 1 }}>
                <div
                  style={{
                    width: "100%",
                    height: `${Math.round((d.amount / maxWeekly) * 52)}px`,
                    background: "var(--mantine-color-blue-5)",
                    borderRadius: 4,
                  }}
                  title={`$${d.amount}`}
                />
                <Text size="xs" c="dimmed">
                  {d.day}
                </Text>
              </Stack>
            ))}
          </Group>
        </Card>

        {/* Category breakdown */}
        <Card withBorder radius="md" padding="md">
          <Text fw={500} mb="sm">
            By category
          </Text>
          <Stack gap="xs">
            {CATEGORY_BREAKDOWN.map((c) => (
              <div key={c.category}>
                <Group justify="space-between" mb={4}>
                  <Text size="sm">{c.category}</Text>
                  <Text size="sm" c="dimmed">
                    ${c.amount}
                  </Text>
                </Group>
                <Progress
                  value={Math.round((c.amount / TOTAL_SPENT) * 100)}
                  color={c.color}
                  size="sm"
                  radius="xl"
                />
              </div>
            ))}
          </Stack>
        </Card>
      </SimpleGrid>

      {/* Recent transactions */}
      <Card withBorder radius="md" padding="md">
        <Group justify="space-between" mb="sm">
          <Text fw={500}>Recent transactions</Text>
          <Text size="sm" c="blue" style={{ cursor: "pointer" }}>
            View all
          </Text>
        </Group>
        <Divider mb="sm" />
        <Stack gap="xs">
          {recent.map((tx) => (
            <Group key={tx.id} justify="space-between">
              <div>
                <Text size="sm" fw={500}>
                  {tx.description}
                </Text>
                <Text size="xs" c="dimmed">
                  {tx.category}
                </Text>
              </div>
              <div style={{ textAlign: "right" }}>
                <Text size="sm" fw={500} c={tx.amount > 0 ? "green" : "red"}>
                  {tx.amount > 0
                    ? `+$${tx.amount}`
                    : `-$${Math.abs(tx.amount)}`}
                </Text>
                <Text size="xs" c="dimmed">
                  {tx.date}
                </Text>
              </div>
            </Group>
          ))}
        </Stack>
      </Card>
    </Stack>
  );
}

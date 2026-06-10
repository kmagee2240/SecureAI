import { Badge, Button, Group, SegmentedControl, Stack, Table, Title } from "@mantine/core";
import { useState } from "react";
import { TRANSACTIONS, type Transaction, type TxStatus } from "../mock/finance";

export default function Transactions() {
  const [filter, setFilter] = useState<TxStatus | "all">("all");

  const filtered =
    filter === "all" ? TRANSACTIONS : TRANSACTIONS.filter((tx) => tx.status === filter);

  return (
    <Stack gap="md">
      <Title order={3}>Transactions</Title>

      <Group justify="space-between">
        <SegmentedControl
          value={filter}
          onChange={(val) => setFilter(val as TxStatus | "all")}
          data={[
            { label: "All", value: "all" },
            { label: "Cleared", value: "cleared" },
            { label: "Pending", value: "pending" },
          ]}
        />
        <Button>Add transaction</Button>
      </Group>

      <Table.ScrollContainer minWidth={500}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Description</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Amount</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filtered.map((tx: Transaction) => (
              <Table.Tr key={tx.id}>
                <Table.Td>{tx.description}</Table.Td>
                <Table.Td>{tx.category}</Table.Td>
                <Table.Td>{tx.date}</Table.Td>
                <Table.Td c={tx.amount > 0 ? "green" : "red"} fw={500}>
                  {tx.amount > 0
                    ? `+$${tx.amount.toFixed(2)}`
                    : `-$${Math.abs(tx.amount).toFixed(2)}`}
                </Table.Td>
                <Table.Td>
                  <Badge color={tx.status === "cleared" ? "green" : "yellow"} variant="light">
                    {tx.status}
                  </Badge>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Stack>
  );
}

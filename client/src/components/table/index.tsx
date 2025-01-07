import {
  IconChevronDown,
  IconChevronUp,
  IconInfoCircle,
  IconSearch,
  IconSelector,
} from "@tabler/icons-react";
import {
  Alert,
  Button,
  Center,
  Group,
  keys,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import classes from "./style.module.css";
import React, { useEffect, useState } from "react";

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort: () => void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={16} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData<T extends object>(data: T[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => String(item[key]).toLowerCase().includes(query))
  );
}

function sortData<T extends object>(
  data: T[],
  payload: { sortBy: keyof T | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData<T>(data, payload.search);
  }

  return filterData<T>(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return String(b[sortBy]).localeCompare(String(a[sortBy]));
      }

      return String(b[sortBy]).localeCompare(String(b[sortBy]));
    }),
    payload.search
  );
}

interface DataTableProps<T> {
  data: T[];
  action: (item: T) => Promise<void> | void;
  actionName: string;
  noDataMessage: string | null;
}

export default function DataTable<T extends object>({
  data,
  action,
  actionName,
  noDataMessage,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof T | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field: keyof T) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value })
    );
  };

  const headers = Object.entries(sortedData[0] ?? []).map((entry) => {
    const [key] = entry;
    return (
      <Th
        sorted={sortBy === key}
        reversed={reverseSortDirection}
        onSort={() => setSorting(key as keyof T)}
        key={key}
      >
        {key}
      </Th>
    );
  });

  useEffect(() => {
    setSortedData(data);
  }, [data]);

  const rows =
    sortedData &&
    sortedData.map((row, i) => (
      <Table.Tr key={i}>
        {Object.entries(row).map(([key, value]) => (
          <Table.Td
            key={key}
            style={{
              maxWidth: "150px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {typeof value === "function" ? (
              React.createElement(value)
            ) : (
              <span>{value}</span>
            )}
          </Table.Td>
        ))}
        <Table.Td>
          <Button
            size="xs"
            variant="light"
            onClick={async () => await action(row)}
          >
            {actionName}
          </Button>
        </Table.Td>
      </Table.Tr>
    ));

  if (!data.length || !Array.isArray(data)) {
    const icon = <IconInfoCircle />;
    return (
      <Alert
        variant="light"
        color="gray"
        title="No tabName"
        maw={400}
        icon={icon}
      >
        {noDataMessage}
      </Alert>
    );
  }

  return (
    <ScrollArea>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        leftSection={<IconSearch size={16} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table
        horizontalSpacing="md"
        verticalSpacing="xs"
        miw={700}
        layout="fixed"
      >
        <Table.Tbody>
          <Table.Tr>
            {headers}
            {headers.length > 0 && <Table.Th>Action</Table.Th>}
          </Table.Tr>
        </Table.Tbody>
        <Table.Tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Td colSpan={Object.keys(data[0]).length + 1}>
                <Text fw={500} ta="center">
                  Nothing found
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}

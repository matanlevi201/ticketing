import { ActionIcon, Flex, Title, useMantineTheme } from "@mantine/core";
import DataTable from "../components/table";
import { Ticket } from "../types";
import { IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { createOrder } from "../api/orders";
import LocalModal from "../components/Modal";
import CreateTicket from "../features/CreateTicket";
import { useOrders, useTickets, useUpdateOrders } from "../stores/state-ctx";

const Tickets = () => {
  const theme = useMantineTheme();
  const [opened, { open, close }] = useDisclosure(false);
  const tickets = useTickets();
  const updateOrders = useUpdateOrders();
  const orders = useOrders();

  const order = async (item: Ticket) => {
    const order = await createOrder({ ticketId: item.id });
    if (order) updateOrders([order, ...orders]);
  };

  return (
    <>
      <LocalModal
        component={(props: Record<string, any>) => <CreateTicket {...props} />}
        componentProps={{ close }}
        title="Create ticket"
        opened={opened}
        close={close}
      />
      <Flex align="center">
        <Title mb="sm">Tickets</Title>
        <ActionIcon variant="light" color="gray" mx="md" onClick={() => open()}>
          <IconPlus size={18} color={theme.colors.blue[6]} stroke={1.5} />
        </ActionIcon>
      </Flex>
      <DataTable
        data={tickets}
        action={order}
        actionName="Order!"
        noDataMessage={
          "There are no tickets in the inventory. Wait for other users to create tickets they wish to sell."
        }
      />
    </>
  );
};

export default Tickets;

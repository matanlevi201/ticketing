import { Box, Button, Container, Flex, Group, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import ThemeToggle from "./theme-toggle/index";
import { FC } from "react";
import LocalModal from "./Modal";

interface HeaderButton {
  label: string;
  component: FC;
  opened: boolean;
  open: () => void;
  close: () => void;
  show: boolean;
}

const Header = ({ headerButtons }: { headerButtons: HeaderButton[] }) => {
  const buttons = headerButtons
    .filter((button) => !!button.show)
    .map(({ component, label, opened, close, open }) => (
      <Box key={label}>
        <LocalModal
          component={component}
          componentProps={{ close }}
          title={label}
          opened={opened}
          close={close}
        />
        <Button variant="default" onClick={open}>
          {label}
        </Button>
      </Box>
    ));
  return (
    <Container style={{ flexGrow: "1" }} fluid h="100%">
      <Flex align="center" justify="space-between" h="100%">
        <Title order={2}>
          <Link style={{ textDecoration: "none", color: "unset" }} to="/">
            Git
            <span style={{ color: "var(--mantine-color-blue-light-color)" }}>
              Tix
            </span>
          </Link>
        </Title>

        <Group>
          {buttons}
          <ThemeToggle />
        </Group>
      </Flex>
    </Container>
  );
};

export default Header;

{
  /* <LocalModal
component={() => <CreateTicket />}
title="Create ticket"
opened={opened}
close={close}
/> */
}

import { AppShell, Burger, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Signup from "../features/Signup";
import Signin from "../features/Signin";
import Signout from "../features/Signout";
import { useCurrentUser } from "../stores/state-ctx";

const Layout = () => {
  const currentUser = useCurrentUser();
  const [opened, { toggle }] = useDisclosure();
  const [openedSignup, { open: openSignup, close: closeSignup }] =
    useDisclosure(false);
  const [openedSignin, { open: openSignin, close: closeSignin }] =
    useDisclosure(false);
  const [openedSignout, { open: openSignout, close: closeSignout }] =
    useDisclosure(false);

  const headerButtons = [
    {
      label: "Sign up",
      component: (props: Record<string, any>) => <Signup {...props} />,
      opened: openedSignup,
      open: openSignup,
      close: closeSignup,
      show: !!!currentUser,
    },
    {
      label: "Sign in",
      component: (props: Record<string, any>) => <Signin {...props} />,
      opened: openedSignin,
      open: openSignin,
      close: closeSignin,
      show: !!!currentUser,
    },
    {
      label: "Sign out",
      component: (props: Record<string, any>) => <Signout {...props} />,
      opened: openedSignout,
      open: openSignout,
      close: closeSignout,
      show: !!currentUser,
    },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Flex h="100%" align="center">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Header headerButtons={headerButtons} />
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Navbar />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout;

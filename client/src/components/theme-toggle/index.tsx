import { IconMoon, IconSun } from "@tabler/icons-react";
import cx from "clsx";
import {
  ActionIcon,
  Group,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import classes from "./style.module.css";

const ThemeToggle = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });

  return (
    <Group justify="center">
      <ActionIcon
        onClick={() =>
          setColorScheme(computedColorScheme === "light" ? "dark" : "light")
        }
        variant="default"
        size="input-sm"
        aria-label="Toggle color scheme"
      >
        {computedColorScheme === "dark" && (
          <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
        )}
        {computedColorScheme === "light" && (
          <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
        )}
      </ActionIcon>
    </Group>
  );
};

export default ThemeToggle;

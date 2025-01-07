import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { StateContextProvider } from "./stores/state-ctx.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider>
      <StateContextProvider>
        <Notifications />
        <App />
      </StateContextProvider>
    </MantineProvider>
  </StrictMode>
);

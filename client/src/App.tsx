import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useMemo } from "react";
import Tickets from "./pages/Tickets";
import Layout from "./pages/Layout";
import Orders from "./pages/Orders";
import RouteGuard from "./pages/RouteGuard";
import NotFound from "./pages/NotFound";
import ErrorElement from "./pages/ErrorElement";

function App() {
  const router = useMemo(() => {
    return createBrowserRouter([
      {
        path: "/",
        element: <Layout />,
        errorElement: <ErrorElement />,
        children: [
          { index: true, element: <Tickets /> },
          {
            path: "orders",
            element: <RouteGuard />,
            children: [{ index: true, element: <Orders /> }],
          },
          { path: "*", element: <NotFound /> },
        ],
      },
    ]);
  }, []);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

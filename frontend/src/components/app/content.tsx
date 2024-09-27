import { AppProvider } from "@/contexts/app-context";
import appRoutes from "@/pages/routes";
import { useMemo } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

export default function Content() {
  const routes = useMemo(() => appRoutes(), []);
  const history = createBrowserRouter(routes);

  const contextValues = useMemo(() => ({
    routes,
  }), [routes]);

  return (
    <AppProvider value={contextValues}>
      <RouterProvider router={history} />
    </AppProvider>
  );
}

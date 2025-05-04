import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";

import "./global.css";
import router from "./router.ts";
import PeerProvider from "./providers/peer-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PeerProvider>
      <RouterProvider router={router} />
    </PeerProvider>
  </StrictMode>
);

"use client";

import { Provider } from "react-redux";
import { store } from "@/store"; // Asegúrate de tener el `store` configurado correctamente

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

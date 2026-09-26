import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { sharedQueryClient } from "@/lib/queryClient";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={sharedQueryClient}>
      {children}
    </QueryClientProvider>
  );
}

"use client";
import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

//would wrap entire application
type Props = {
  childern: React.ReactNode;
};

const queryClient = new QueryClient();

const Providers = ({ childern }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>{childern}</QueryClientProvider>
  );
};

export default Providers;

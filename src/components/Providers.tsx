"use client";

import { SessionProvider } from "next-auth/react";
import type { FC, ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

const Providers: FC<any> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default Providers;

"use client";

import React, { ReactNode } from "react";
import { PaymentProvider as PaymentContextProvider } from "@/contexts/payment-context";

export const PaymentProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return <PaymentContextProvider>{children}</PaymentContextProvider>;
};

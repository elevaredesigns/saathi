import type { Metadata } from "next";

import { PrototypeProvider } from "@/lib/context/PrototypeContext";
import { ConsoleProvider } from "@/lib/console/store";

export const metadata: Metadata = {
  title: "Saathi for Departments — officer console",
  description: "The other side of every Saathi service: a console where each department reviews applications, checks e-KYC with purpose, issues records and runs challans, exams and benefit transfers. A design concept with sample data.",
};

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <PrototypeProvider>
      <ConsoleProvider>{children}</ConsoleProvider>
    </PrototypeProvider>
  );
}

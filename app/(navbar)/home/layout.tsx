import React from "react";
import Navbar from "@/app/components/Navbar";
import { ReduxProvider } from "@/app/ReduxProvider"; // adjust path as needed

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <section className="max-lg:flex max-lg:flex-col">
        <Navbar />
        <div className="ml-80 max-xl:ml-60 max-lg:mt-20 max-lg:ml-0">
          {children}
        </div>
      </section>
    </ReduxProvider>
  );
}

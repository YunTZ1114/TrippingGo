"use client";

import { SideBar } from "./components";
import "./styles.css";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex h-screen w-full flex-col bg-primary">
      <div className="mt-4 flex flex-1 gap-2">
        <SideBar />
        <div className="h-full flex-1 rounded-tl-3xl bg-surface shadow-paper">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;

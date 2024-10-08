"use client";

import { SideBar } from "./components";
import "./styles.css";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="w-full flex flex-col h-screen bg-primary">
      <div className="flex-1 flex gap-2 mt-4">
        <SideBar />
        <div className="h-full flex-1 rounded-tl-3xl bg-surface shadow-paper">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;

import * as React from "react";
import { Outlet, Link } from "react-router-dom";
import { Navbar } from "../navbar";

const Layout = ({ children }: { children: any }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default Layout;

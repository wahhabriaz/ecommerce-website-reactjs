import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Components/Header/Navbar";
import Footer from "../Components/Footer/Footer";

export default function StoreLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      
    </>
  );
}

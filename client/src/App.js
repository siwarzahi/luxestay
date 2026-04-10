import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/login";
import Rooms from "./pages/Rooms";

const AppWrapper = () => {
  const location = useLocation();
  const hideNavbar = location.pathname.includes("owner");

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <div className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AppWrapper />
  </BrowserRouter>
);

export default App;
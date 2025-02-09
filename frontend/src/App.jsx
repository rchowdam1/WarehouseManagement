import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Layout from "./components/Layout/Layout";
import Landing from "./pages/Landing";

function App() {
  // resume here 1/25, the Landing page is not displaying the correct navbar
  return (
    <Routes>
      <Route path="/" element={<Home />} exact={true} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/landing" element={<Landing />} />
    </Routes>
  );
}

export default App;

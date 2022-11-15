import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./common/Footer";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Help from "./components/Help";
import Works from "./components/Works";
import Register from "./components/Register";
import Contents from "./components/Details";

function App() {
  return (
    <Routes>
      <Route path="contents" element={<Contents />} />
      <Route path="profile" element={<Profile />} />
      <Route path="works" element={<Works />} />
      <Route path="help" element={<Help />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="home" element={<Home />} />
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export function WrappedApp() {
  return (
    <HashRouter>
      <Navbar />
      <App />
      <Footer/>
    </HashRouter>
  );
}

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import SignupForm from "./components/signup/signup";
import LoginForm from "./components/login/login";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import HomePage from "./components/Home/HomePage";
import SideBar from "./components/Home/SideBar";
import { getTokenCookie } from "./AuthCookie/authToken";
import axios from "axios";
import AdditionalDetailsForm from "./components/AdditionalDetailsForm/AdditionalDetailsForm";
import UserDetails from "./components/AdditionalDetailsForm/Userdetails";
import ProfilePage from "./components/Profile/myProfile";
import ConnectionsPage from "./components/Profile/Connection";
axios.defaults.baseURL = process.env.REACT_APP_BACKEND_BASE_URL;
function App() {
  const user = getTokenCookie();
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Navbar />
        {user && (
          <aside>
            <SideBar />
          </aside>
        )}

        <div>
          <Routes>
            <Route index path="/" element={<HomePage />} />
            <Route
              path="/signup"
              element={user ? <HomePage /> : <SignupForm />}
            />
            <Route
              path="/login"
              element={user ? <HomePage /> : <LoginForm />}
            />
            <Route
              path="/add-details"
              element={user ? <UserDetails /> : <LoginForm />}
            />
            <Route
              path="/my-profile"
              element={user ? <ProfilePage /> : <LoginForm />}
            />
            <Route
              path="/my-connections"
              element={user ? <ConnectionsPage /> : <LoginForm />}
            />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
      <CSSReset />
    </ChakraProvider>
  );
}

export default App;

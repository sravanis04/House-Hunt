import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Common components
import Home from "./modules/common/Home";
import Login from "./modules/common/Login";
import Register from "./modules/common/Register";
import ForgotPassword from "./modules/common/ForgotPassword";

// Role-specific components
import AdminHome from "./modules/admin/AdminHome";
// CORRECTED PATH: No longer inside a 'user' subfolder
import OwnerHome from "./modules/user/Owner/OwnerHome";
// CORRECTED PATH: No longer inside a 'user' subfolder
import RenterHome from "./modules/user/renter/RenterHome";

import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

function App() {
  const date = new Date().getFullYear();
  const [userData, setUserData] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        setUserData(user);
        setUserLoggedIn(true);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const contextValue = {
    userData,
    setUserData,
    userLoggedIn,
    setUserLoggedIn,
  };

  return (
    <UserContext.Provider value={contextValue}>
      <div className="App">
        <Router>
          <div className="content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />

              {/* Protected Routes */}
              {userLoggedIn ? (
                <>
                  <Route path="/adminhome" element={userData?.type === 'Admin' ? <AdminHome /> : <Navigate to="/" />} />
                  <Route path="/ownerhome" element={userData?.type === 'Owner' ? <OwnerHome /> : <Navigate to="/" />} />
                  <Route path="/renterhome" element={userData?.type === 'Renter' ? <RenterHome /> : <Navigate to="/" />} />
                   {/* Redirect logged-in users from login/register to their home */}
                  <Route path="/login" element={<Navigate to={userData?.type === 'Admin' ? '/adminhome' : userData?.type === 'Owner' ? '/ownerhome' : '/renterhome'} />} />
                  <Route path="/register" element={<Navigate to={userData?.type === 'Admin' ? '/adminhome' : userData?.type === 'Owner' ? '/ownerhome' : '/renterhome'} />} />
                </>
              ) : (
                /* Redirect any attempt to access protected routes to login */
                 <Route path="*" element={<Navigate to="/" />} />
              )}
            </Routes>
          </div>
          <footer className="bg-light text-center text-lg-start">
            <div className="text-center p-3">
              © {date} Copyright: RentEase
            </div>
          </footer>
        </Router>
      </div>
    </UserContext.Provider>
  );
}

export default App;
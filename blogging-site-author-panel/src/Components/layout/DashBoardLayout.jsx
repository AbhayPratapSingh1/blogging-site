import Header from "./Header";
import Sidebar from "./Sidebar";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";

import { setAuthorizationToken } from "./../../utils/setAuthorizationHeader";
import { getuserRequest } from "./../../features/loginSlice";
import {
  setIsAuthenticated,
  toggleMultiSelectMenu,
} from "../../features/appSlice";

function DashBoardLayout({ children, title, description }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((store) => store.app.isAuthenticated);
  const user = useSelector((state) => state.login.user);

  const [headerFixed, setHeaderFixed] = useState(false);

  const handleInvalidToken = () => {
    localStorage.clear();
    dispatch(setIsAuthenticated(false));
    setAuthorizationToken(false);
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("abToken");
    if (!token) {
      handleInvalidToken();
      return;
    }

    const tokenData = jwtDecode(token);

    if (tokenData.exp && tokenData.exp < Math.floor(Date.now() / 1000)) {
      handleInvalidToken();
      return;
    }

    setAuthorizationToken(token);
    setHeaderFixed(true);
    dispatch(setIsAuthenticated(true));

    if (!user?._id) {
      dispatch(getuserRequest());
    }
  }, [navigate, dispatch, isAuthenticated]);

  if (isAuthenticated && headerFixed) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-grow flex flex-col">
          <Header title={title} description={description} />
          <main className="flex-grow">
            {children}
          </main>
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
}

export default DashBoardLayout;

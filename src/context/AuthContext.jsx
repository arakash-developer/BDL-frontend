import { notification } from "antd";
import { createContext, useEffect, useState } from "react";
import axios from "../axios";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    if (authUser) {
      setAuthUser(authUser);
    }
  }, []);

  useEffect(() => {
    const getUserStatus = async (id) => {
      if (authUser) {
        try {
          const res = await axios.get(`users/${id}`);
          if (res.status === 200) {
            if (res.data.status !== "active") {
              localStorage.removeItem("authUser");
              setAuthUser(null);
              notification.error({
                message: "Error",
                description: "Please activate your account",
                placement: "top",
                duration: 2,
              });
            }
          }
          if (res.status === 404) {
            localStorage.removeItem("authUser");
            setAuthUser(null);
            notification.error({
              message: "Error",
              description: "User not found",
              placement: "top",
              duration: 2,
            });
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    const interval = setInterval(() => {
      getUserStatus(authUser?.user);
    }, 30000);

    return () => clearInterval(interval);
  });

  const login = async (data) => {
    try {
      const res = await axios.post("users/login", data);
      if (res.status === 200) {
        localStorage.setItem("authUser", JSON.stringify(res.data));
        setAuthUser(res.data);
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Error",
        description: error.response.data.message,
        placement: "top",
        duration: 2,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ login, authUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

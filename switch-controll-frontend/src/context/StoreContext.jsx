import { Children, useState } from "react";
import { createContext } from "react";

export const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const [deviceStatus, setDeviceStatus] = useState(null);
  const values = {
    backendUrl: "https://smart-switch-controll.onrender.com",
    // backendUrl: "http://localhost:5000",
    deviceStatus,
    setDeviceStatus,
  };
  return (
    <StoreContext.Provider value={values}>{children}</StoreContext.Provider>
  );
};

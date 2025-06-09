import { Children, useState } from "react";
import { createContext } from "react";

export const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const [deviceStatus, setDeviceStatus] = useState(null);
  const values = {
    backendUrl: "https://smart-switch-controll.onrender.com",
   
    deviceStatus,
    setDeviceStatus,
  };
  return (
    <StoreContext.Provider value={values}>{children}</StoreContext.Provider>
  );
};

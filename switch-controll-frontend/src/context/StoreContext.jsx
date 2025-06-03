import { Children } from "react";
import { createContext } from "react";

export const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const values = {
    backendUrl: "https://smart-switch-controll.onrender.com",
  };
  return (
    <StoreContext.Provider value={values}>{children}</StoreContext.Provider>
  );
};

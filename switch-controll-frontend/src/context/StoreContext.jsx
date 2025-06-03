import { Children } from "react";
import { createContext } from "react";

export const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const values = {
    backendUrl: "http://localhost:5000",
  };
  return (
    <StoreContext.Provider value={values}>{children}</StoreContext.Provider>
  );
};

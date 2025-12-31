import { createContext, useContext } from "react";

// Create the context
export const AuthContext = createContext(null);

// Create a custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

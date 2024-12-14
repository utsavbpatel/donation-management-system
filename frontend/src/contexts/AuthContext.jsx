import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
}

export const AuthProvider = (props) => {
  const [isActive, setIsActive] = useState(
    () => JSON.parse(localStorage.getItem('isActive')) || false
  );

  const [isSetup, setIsSetup] = useState(
    () => JSON.parse(localStorage.getItem('isSetup')) || false
  );

  const [userId, setUserId] = useState(() => {
    return localStorage.getItem("userId") || "";
  });

  useEffect(() => {
    localStorage.setItem('isActive', JSON.stringify(isActive));
  }, [isActive]);

  useEffect(() => {
    localStorage.setItem('isSetup', JSON.stringify(isSetup));
  }, [isSetup]);


  useEffect(() => {
    if (userId) {
      localStorage.setItem("userId", userId);
    }
  }, [userId]);

  return (
    <AuthContext.Provider value={{ isActive, setIsActive, isSetup, setIsSetup, userId, setUserId }}>
      {props.children}
    </AuthContext.Provider>
  )
}

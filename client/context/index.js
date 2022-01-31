import { useState, createContext, useEffect } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [state, setState] = useState({
    user: {},
    token: "",
  });

  //updating state if data available in local storage
  useEffect(() => {
    setState(JSON.parse(window.localStorage.getItem("auth")));
  }, []);
  return (
    <UserContext.Provider value={[state, setState]}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };

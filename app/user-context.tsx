"use client";

import React, { createContext, useState, useContext } from "react";

// Define el tipo del contexto
interface IUserContext {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

// Crea el contexto con un valor por defecto que cumpla con el tipo
export const UserContext = createContext<IUserContext>({
  user: null,
  setUser: () => {}, // función vacía por defecto
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

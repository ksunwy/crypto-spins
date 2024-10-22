"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';

const BalanceContext = createContext<{ balance: bigint | null, setBalance: (balance: bigint | null) => void } | undefined>(undefined);

const BALANCE_KEY = 'userBalance';
const EXPIRATION_KEY = 'balanceExpiration'; 

export const BalanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<bigint | null>(null);

  useEffect(() => {
    const storedBalance = localStorage.getItem(BALANCE_KEY);
    const expiration = localStorage.getItem(EXPIRATION_KEY);
    
    if (storedBalance && expiration) {
      const expirationDate = new Date(parseInt(expiration));
      const now = new Date();

      if (now < expirationDate) {
        setBalance(BigInt(storedBalance)); 
      } else {
        localStorage.removeItem(BALANCE_KEY); 
        localStorage.removeItem(EXPIRATION_KEY); 
      }
    }
  }, []);

  const updateBalance = (newBalance: bigint | null) => {
    setBalance(newBalance);
    if (newBalance !== null) {
      localStorage.setItem(BALANCE_KEY, newBalance.toString());
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 24); 
      localStorage.setItem(EXPIRATION_KEY, expirationDate.getTime().toString());
    } else {
      localStorage.removeItem(BALANCE_KEY);
      localStorage.removeItem(EXPIRATION_KEY);
    }
  };

  return (
    <BalanceContext.Provider value={{ balance, setBalance: updateBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};

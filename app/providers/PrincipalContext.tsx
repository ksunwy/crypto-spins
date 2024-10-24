"use client";

import React, { createContext, useContext, useState, useEffect, FC, ReactNode } from "react";

interface PrincipalContextType {
  principalId: string | null;
  actor: any;
  balance: bigint | null;
  setBalance: (balance: bigint | null) => void;
  setPrincipalId: (id: string | null) => void;
  setActor: (actor: any) => void;
  deposit: (amount: bigint) => Promise<bigint>;
  withdraw: (principal: any, amount: bigint) => Promise<{ Ok?: bigint; Err?: string }>;
  play: (bet: bigint) => Promise<{ Ok?: { player: any; bet: bigint; result: number[]; payout: bigint }; Err?: string }>;
  getBalance: () => Promise<bigint>;
  getGames: () => Promise<Array<{ player: any; bet: bigint; result: number[]; payout: bigint }>>;
  getContractBalance: () => Promise<bigint>;
  setWinPercentage: (newPercentage: bigint) => Promise<{ Ok?: null; Err?: string }>;
}

export const PrincipalContext = createContext<PrincipalContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_ID = "principalId";
const LOCAL_STORAGE_KEY_BALANCE = "balance";
const LOCAL_STORAGE_KEY_ACTOR = "actor"; 
const EXPIRATION_TIME = 24 * 60 * 60 * 1000; 
const BALANCE_KEY = 'userBalance';
const EXPIRATION_KEY = 'balanceExpiration';

export const PrincipalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [principalId, setPrincipalIdState] = useState<string | null>(null);
  const [actor, setActorState] = useState<any | null>(null);
  const [balance, setBalance] = useState<bigint | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

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

    const storedActor = localStorage.getItem(LOCAL_STORAGE_KEY_ACTOR);
    if (storedActor) {
      const { actor: storedActorData, expirationDate } = JSON.parse(storedActor);
      const now = new Date().getTime();
      if (now < expirationDate) {
        setActorState(storedActorData);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY_ACTOR);
      }
    }

    const storedDataId = localStorage.getItem(LOCAL_STORAGE_KEY_ID);
    if (storedDataId) {
      const { id, expirationDate } = JSON.parse(storedDataId);
      const now = new Date().getTime();
      if (now < expirationDate) {
        setPrincipalIdState(id);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY_ID);
      }
    }
  }, [isClient]);

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

  const setActor = (newActor: any) => {
    setActorState(newActor);
    if (newActor) {
      const expirationDate = new Date().getTime() + EXPIRATION_TIME;
      localStorage.setItem(LOCAL_STORAGE_KEY_ACTOR, JSON.stringify({ actor: newActor, expirationDate }));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_ACTOR);
    }
  };

  const setPrincipalId = (id: string | null) => {
    setPrincipalIdState(id);
    if (id) {
      const expirationDate = new Date().getTime() + EXPIRATION_TIME;
      localStorage.setItem(LOCAL_STORAGE_KEY_ID, JSON.stringify({ id, expirationDate }));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_ID);
    }
  };

  const getActor = (): any => {
    if (actor) return actor;
    
    const storedActor = localStorage.getItem(LOCAL_STORAGE_KEY_ACTOR);
    if (storedActor) {
      const { actor: storedActorData, expirationDate } = JSON.parse(storedActor);
      const now = new Date().getTime();
      if (now < expirationDate) {
        setActorState(storedActorData);
        return storedActorData;
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY_ACTOR);
      }
    }
    throw new Error("Actor не установлен");
  };

  const deposit = async (amount: bigint): Promise<bigint> => {
    const currentActor = getActor();
    const result = await currentActor.deposit(amount);
    return result;
  };

  const withdraw = async (principal: any, amount: bigint): Promise<{ Ok?: bigint; Err?: string }> => {
    const currentActor = getActor();
    const result = await currentActor.withdraw(principal, amount);
    return result;
  };

  const play = async (bet: bigint): Promise<{ Ok?: { player: any; bet: bigint; result: number[]; payout: bigint }; Err?: string }> => {
    const currentActor = getActor();
    const result = await currentActor.play(bet);
    return result;
  };

  const getBalance = async (): Promise<bigint> => {
    const currentActor = getActor();
    const result = await currentActor.get_balance();
    return result;
  };

  const getGames = async (): Promise<Array<{ player: any; bet: bigint; result: number[]; payout: bigint }>> => {
    const currentActor = getActor();
    const result = await currentActor.get_games();
    return result;
  };

  const getContractBalance = async (): Promise<bigint> => {
    const currentActor = getActor();
    const result = await currentActor.get_contract_balance();
    return result;
  };

  const setWinPercentage = async (newPercentage: bigint): Promise<{ Ok?: null; Err?: string }> => {
    const currentActor = getActor();
    const result = await currentActor.set_win_percentage(newPercentage);
    return result;
  };

  const value = {
    principalId,
    actor,
    balance,
    setBalance: updateBalance,
    setPrincipalId,
    setActor,
    deposit,
    withdraw,
    play,
    getBalance,
    getGames,
    getContractBalance,
    setWinPercentage,
  };

  if (!isClient) {
    return null;
  }

  return (
    <PrincipalContext.Provider value={value}>
      {children}
    </PrincipalContext.Provider>
  );
};

export const usePrincipal = () => {
  const context = useContext(PrincipalContext);
  return context;
};

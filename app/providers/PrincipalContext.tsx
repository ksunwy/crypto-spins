"use client";

import React, { createContext, useContext, useState, useEffect, FC, ReactNode } from "react";

interface PrincipalContextType {
  principalId: string | null;
  // balance: bigint | null;
  actor: any;
  balance: bigint | null;
  setBalance: (balance: bigint | null) => void;
  setPrincipalId: (id: string | null) => void;
  // setBalance: (balance: bigint | null) => void;
  setActor: (actor: any) => void;
  deposit: (amount: bigint) => Promise<bigint>;
  withdraw: (principal: any, amount: bigint) => Promise<{ Ok?: bigint; Err?: string }>;
  play: (bet: bigint) => Promise<{ Ok?: { player: any; bet: bigint; result: number[]; payout: bigint }; Err?: string }>;
  getBalance: () => Promise<bigint>;
  getGames: () => Promise<Array<{ player: any; bet: bigint; result: number[]; payout: bigint }>>;
  getContractBalance: () => Promise<bigint>;
  setWinPercentage: (newPercentage: bigint) => Promise<{ Ok?: null; Err?: string }>;
}

const PrincipalContext = createContext<PrincipalContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_ID = "principalId";
const LOCAL_STORAGE_KEY_BALANCE = "balance";
const LOCAL_STORAGE_KEY_ACTOR = "actor"; 
const EXPIRATION_TIME = 24 * 60 * 60 * 1000; 

const BALANCE_KEY = 'userBalance';
const EXPIRATION_KEY = 'balanceExpiration'; 

export const PrincipalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [principalId, setPrincipalIdState] = useState<string | null>(null);
  // const [balance, setBalanceState] = useState<bigint | null>(null); 
  const [actor, setActorState] = useState<any | null>(null);

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


  const setActor = (newActor: any) => {
    setActorState(newActor);
    if (newActor) {
      const expirationDate = new Date().getTime() + EXPIRATION_TIME;
      localStorage.setItem(LOCAL_STORAGE_KEY_ACTOR, JSON.stringify({ actor: newActor, expirationDate }));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_ACTOR);
    }
  };

  // const setBalance = (newBalance: bigint | null) => {
  //   setBalanceState(newBalance);
  //   if (newBalance !== null) {
  //     const expirationDate = new Date().getTime() + EXPIRATION_TIME;
  //     localStorage.setItem(LOCAL_STORAGE_KEY_BALANCE, JSON.stringify({ balance: newBalance.toString(), expirationDate }));
  //   } else {
  //     localStorage.removeItem(LOCAL_STORAGE_KEY_BALANCE);
  //   }
  // };

  const setPrincipalId = (id: string | null) => {
    setPrincipalIdState(id);
    if (id) {
      const expirationDate = new Date().getTime() + EXPIRATION_TIME;
      localStorage.setItem(LOCAL_STORAGE_KEY_ID, JSON.stringify({ id, expirationDate }));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_ID);
    }
  };

  const deposit = async (amount: bigint): Promise<bigint> => {
    const result = await actor.deposit(amount);
    if (typeof result !== 'bigint') {
      throw new Error('Expected a bigint response');
    }
    return result;
  };

  const withdraw = async (principal: any, amount: bigint): Promise<{ Ok?: bigint; Err?: string }> => {
    const result = await actor.withdraw(principal, amount);
    if (typeof result !== 'object' || result === null) {
      throw new Error('Unexpected response format');
    }
    if ('Ok' in result && typeof result.Ok === 'bigint') {
      return { Ok: result.Ok };
    } else if ('Err' in result && typeof result.Err === 'string') {
      return { Err: result.Err };
    } else {
      throw new Error('Invalid response type from actor.withdraw');
    }
  };

  const play = async (
    bet: bigint
  ): Promise<{ Ok?: { player: any; bet: bigint; result: number[]; payout: bigint }; Err?: string }> => {
    const result: unknown = await actor.play(bet);
  
    if (typeof result === "object" && result !== null && ("Ok" in result || "Err" in result)) {
      return result as { Ok?: { player: any; bet: bigint; result: number[]; payout: bigint }; Err?: string };
    } else {
      throw new Error("Unexpected response format from actor.play");
    }
  };
  
  const getBalance = async (): Promise<bigint> => {
    const result = await actor.get_balance();
    if (typeof result !== 'bigint') {
      throw new Error('Unexpected response type: expected bigint');
    }
    return result;
  };

  const getGames = async (): Promise<Array<{ player: any; bet: bigint; result: number[]; payout: bigint }>> => {
    const result = await actor.get_games();
    if (!Array.isArray(result)) {
      throw new Error('Unexpected response type: expected an array');
    }
    return result.map(game => {
      if (typeof game.player !== 'object' || typeof game.bet !== 'bigint' || !Array.isArray(game.result) || typeof game.payout !== 'bigint') {
        throw new Error('Unexpected game object structure');
      }
      return game;
    });
  };

  const getContractBalance = async (): Promise<bigint> => {
    const result = await actor.get_contract_balance();
    if (typeof result !== 'bigint') {
      throw new Error('Unexpected response type: expected bigint');
    }
    return result;
  };

  const setWinPercentage = async (newPercentage: bigint): Promise<{ Ok?: null; Err?: string }> => {
    const result: unknown = await actor.set_win_percentage(newPercentage);
    if (typeof result === "object" && result !== null && "Ok" in result && "Err" in result) {
      const { Ok, Err } = result as { Ok?: unknown; Err?: unknown };
      if ((Ok === null || Ok === undefined) && (typeof Err === "string" || Err === undefined)) {
        return { Ok: Ok as null, Err: Err as string | undefined };
      }
    }
    throw new Error("Unexpected response structure from set_win_percentage");
  };

  useEffect(() => {
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

    // const storedDataBalance = localStorage.getItem(LOCAL_STORAGE_KEY_BALANCE);
    // if (storedDataBalance) {
    //   const { balance, expirationDate } = JSON.parse(storedDataBalance);
    //   const now = new Date().getTime();
    //   if (now < expirationDate) {
    //     setBalanceState(BigInt(balance));
    //   } else {
    //     localStorage.removeItem(LOCAL_STORAGE_KEY_BALANCE);
    //   }
    // }

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
  }, []);

  return (
    <PrincipalContext.Provider
      value={{
        principalId,
        setPrincipalId,
        deposit,
        withdraw,
        play,
        balance, setBalance: updateBalance,
        actor, 
        // setBalance,
        setActor,
        getBalance,
        getGames,
        getContractBalance,
        setWinPercentage,
      }}
    >
      {children}
    </PrincipalContext.Provider>
  );
};

export const usePrincipal = () => {
  const context = useContext(PrincipalContext);
  if (!context) {
    throw new Error("usePrincipal должен использоваться внутри PrincipalProvider");
  }
  return context;
};
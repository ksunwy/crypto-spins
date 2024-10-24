import { create } from 'zustand';

interface ActorState {
  principalId: string | null;
  deposit: ((amount: bigint) => Promise<bigint>) | null;
  play: ((bet: bigint) => Promise<{ Ok?: any; Err?: string }>) | null;
  setActorMethods: (deposit: (amount: bigint) => Promise<bigint> | null, play: (bet: bigint) => Promise<{ Ok?: any; Err?: string }> | null) => void;
  setPrincipalId: (id: string) => void;
}

export const useActorStore = create<ActorState>((set) => ({
  principalId: null,
  deposit: null,
  play: null,
  //@ts-ignore
  setActorMethods: (deposit, play) => set({ deposit, play }),
  setPrincipalId: (id) => set({ principalId: id }),
}));
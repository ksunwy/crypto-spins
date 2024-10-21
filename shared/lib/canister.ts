import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "@/shared/lib/contract.did.ts";
import { type PlayResult, type Game } from "@/shared/types/type";

const canisterId = "jeoiu-zqaaa-aaaal-amq2q-cai";

// Создание агента для взаимодействия с канистрой
const createActor = (canisterId: string, agent: HttpAgent) => {
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
};

// Инициализация агента
export const initAgent = async () => {
  const agent = new HttpAgent();
  if (process.env.DFX_NETWORK === 'https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=jeoiu-zqaaa-aaaal-amq2q-cai') {
    await agent.fetchRootKey(); // Только для локального развертывания
  }
  return createActor(canisterId, agent);
};

// Функция депозита
export const deposit = async (amount: bigint): Promise<bigint> => {
  const actor = await initAgent();
  const result = await actor.deposit(amount);

  if (typeof result !== 'bigint') {
    throw new Error('Expected a bigint response');
  }

  return result as bigint;
};

// Функция вывода средств
export const withdraw = async (principal:
  any
  //  Principal
  , amount: bigint): Promise<{ Ok?: bigint; Err?: string }> => {
  const actor = await initAgent();
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

// Функция игры
export const play = async (
  bet: bigint
): Promise<{ Ok?: { player: 
  any
  // Principal
  ; bet: bigint; result: number[]; payout: bigint }; Err?: string }> => {
  const actor = await initAgent();
  return actor.play(bet) as { Ok?: { player: 
    // Principal
    any
    ; bet: bigint; result: number[]; payout: bigint }; Err?: string };
};

// Функция получения баланса игрока
export const getBalance = async (): Promise<bigint> => {
  const actor = await initAgent();
  const result = await actor.get_balance();

  if (typeof result !== 'bigint') {
    throw new Error('Unexpected response type: expected bigint');
  }

  return result;
};

// Функция получения истории игр
export const getGames = async (): Promise<Array<{ player: any; bet: bigint; result: number[]; payout: bigint }>> => {
  const actor = await initAgent();
  const result = await actor.get_games();

  if (!Array.isArray(result)) {
    throw new Error('Unexpected response type: expected an array');
  }

  return result.map(game => {
    if (
      typeof game.player !== 'object' ||
      typeof game.bet !== 'bigint' ||
      !Array.isArray(game.result) ||
      typeof game.payout !== 'bigint'
    ) {
      throw new Error('Unexpected game object structure');
    }

    return game as { player: any; bet: bigint; result: number[]; payout: bigint }; 
  });
};
// Функция получения общего баланса контракта
export const getContractBalance = async (): Promise<bigint> => {
  const actor = await initAgent();
  const result = await actor.get_contract_balance();

  if (typeof result !== 'bigint') {
    throw new Error('Unexpected response type: expected bigint');
  }

  return result;
};

// Исправленная функция изменения шанса выигрыша с явной типизацией
export const setWinPercentage = async (newPercentage: bigint): Promise<{ Ok?: null; Err?: string }> => {
  const actor = await initAgent();

  const result: unknown = await actor.set_win_percentage(newPercentage);

  if (typeof result === 'object' && result !== null && 'Ok' in result && 'Err' in result) {
    return result as { Ok?: null; Err?: string }; 
  }

  throw new Error('Unexpected response structure from set_win_percentage');
};

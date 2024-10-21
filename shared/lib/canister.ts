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
  return actor.deposit(amount);
};

// Функция вывода средств
export const withdraw = async (principal: Principal, amount: bigint): Promise<{ Ok?: bigint; Err?: string }> => {
  const actor = await initAgent();
  return actor.withdraw(principal, amount);
};

// Функция игры
export const play = async (bet: bigint): Promise<{ Ok?: { player: Principal, bet: bigint, result: number[], payout: bigint }, Err?: string }> => {
  const actor = await initAgent();
  return actor.play(bet);
};

// Функция получения баланса игрока
export const getBalance = async (): Promise<bigint> => {
  const actor = await initAgent();
  return actor.get_balance();
};

// Функция получения истории игр
export const getGames = async (): Promise<Array<{ player: Principal, bet: bigint, result: number[], payout: bigint }>> => {
  const actor = await initAgent();
  return actor.get_games();
};

// Функция получения общего баланса контракта
export const getContractBalance = async (): Promise<bigint> => {
  const actor = await initAgent();
  return actor.get_contract_balance();
};

// Исправленная функция изменения шанса выигрыша с явной типизацией
export const setWinPercentage = async (newPercentage: bigint): Promise<{ Ok?: null; Err?: string }> => {
  const actor = await initAgent();
  // Явная типизация результата
  const result: { Ok?: null; Err?: string } = await actor.set_win_percentage(newPercentage);
  return result;
};
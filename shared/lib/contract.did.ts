import { IDL } from "@dfinity/candid";

export const idlFactory = ({ IDL }: { IDL: any }) => {
  return IDL.Service({
    deposit: IDL.Func([IDL.Nat64], [IDL.Nat64], []), // Депозит игрока
    withdraw: IDL.Func([IDL.Principal, IDL.Nat64], [IDL.Variant({ Ok: IDL.Nat64, Err: IDL.Text })], []), // Вывод средств
    play: IDL.Func([IDL.Nat64], [IDL.Variant({
      Ok: IDL.Record({
        player: IDL.Principal,
        bet: IDL.Nat64,
        result: IDL.Vec(IDL.Nat8),
        payout: IDL.Nat64,
      }),
      Err: IDL.Text,
    })], []), // Игра
    get_balance: IDL.Func([], [IDL.Nat64], ['query']), // Получение баланса игрока
    get_games: IDL.Func([], [IDL.Vec(IDL.Record({
      player: IDL.Principal,
      bet: IDL.Nat64,
      result: IDL.Vec(IDL.Nat8),
      payout: IDL.Nat64,
    }))], ['query']), // История игр
    get_contract_balance: IDL.Func([], [IDL.Nat64], ['query']), // Получение общего баланса контракта
    set_win_percentage: IDL.Func([IDL.Nat64], [IDL.Variant({ Ok: IDL.Null, Err: IDL.Text })], []), // Установка шанса выигрыша
  });
};
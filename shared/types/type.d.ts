export interface Game {
    player: Principal;
    bet: bigint;
    result: number[];
    payout: bigint;
  }
  
  export interface PlayResult {
    Ok?: Game;
    Err?: string;
  }
  
  export interface WithdrawResult {
    Ok?: bigint;
    Err?: string;
  }
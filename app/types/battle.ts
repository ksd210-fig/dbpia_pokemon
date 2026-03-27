export type Move = {
  name: string;
  damage: number;
  healAmount?: number;
  selfDamage?: number;
  pp: number;
  maxPp: number;
  /** 기술 타입 (표시용, 예: "노말", "물") */
  type?: string;
};

export type Fighter = {
  name: string;
  hp: number;
  maxHp: number;
  moves: Move[];
  /** 레벨 (표시용) */
  level?: number;
};

export type BattleStatus = "idle" | "processing" | "won" | "lost";

export type BattleState = {
  player: Fighter;
  enemy: Fighter;
  log: string[];
  status: BattleStatus;
};

export type BattleAction =
  | { type: "PLAYER_MOVE"; index: number }
  | { type: "ENEMY_MOVE"; index: number }
  | { type: "SET_PLAYER"; fighter: Fighter }
  | { type: "SET_ENEMY"; fighter: Fighter }
  | { type: "ADD_LOG"; lines: string[] }
  | { type: "SET_STATUS"; status: BattleStatus }
  | { type: "RESET" };

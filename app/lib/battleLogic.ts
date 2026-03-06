import type { BattleState, BattleAction, Fighter, Move } from "../types/battle";
import { INITIAL_PLAYER, INITIAL_ENEMY } from "../data/fighters";

export function cloneFighter(fighter: Fighter): Fighter {
  return {
    ...fighter,
    moves: fighter.moves.map((move) => ({ ...move })),
  };
}

export function createInitialState(): BattleState {
  return {
    player: cloneFighter(INITIAL_PLAYER),
    enemy: cloneFighter(INITIAL_ENEMY),
    log: [],
    status: "idle",
  };
}

function clampHp(nextHp: number, maxHp: number): number {
  return Math.max(0, Math.min(maxHp, nextHp));
}

export function consumeMove(fighter: Fighter, index: number): Fighter {
  const move = fighter.moves[index];
  if (!move || move.pp <= 0) {
    return fighter;
  }
  return {
    ...fighter,
    moves: fighter.moves.map((m, i) =>
      i === index ? { ...m, pp: Math.max(0, m.pp - 1) } : m
    ),
  };
}

const EFFECT_WEAK = "효과는 미미한 듯 하다";
const EFFECT_GREAT = "효과는 굉장했다!";
const DAMAGE_THRESHOLD_LOW = 10;  // 이하면 미미
const DAMAGE_THRESHOLD_HIGH = 20; // 이상이면 굉장

function getEffectMessage(amount: number): string | null {
  if (amount <= DAMAGE_THRESHOLD_LOW) return EFFECT_WEAK;
  if (amount >= DAMAGE_THRESHOLD_HIGH) return EFFECT_GREAT;
  return null;
}

export function applyMove(
  attacker: Fighter,
  defender: Fighter,
  move: Move
): { attacker: Fighter; defender: Fighter; resultLine: string | null } {
  if (move.damage > 0) {
    const nextDefenderHp = clampHp(defender.hp - move.damage, defender.maxHp);
    return {
      attacker,
      defender: { ...defender, hp: nextDefenderHp },
      resultLine: getEffectMessage(move.damage),
    };
  }

  const healAmount = move.healAmount ?? 0;
  const nextAttackerHp = clampHp(attacker.hp + healAmount, attacker.maxHp);

  return {
    attacker: { ...attacker, hp: nextAttackerHp },
    defender,
    resultLine: `${attacker.name}의 체력이 회복되었다!`,
  };
}

export function pickRandomUsableMoveIndex(fighter: Fighter): number | null {
  const usableIndexes = fighter.moves
    .map((move, index) => ({ move, index }))
    .filter(({ move }) => move.pp > 0)
    .map(({ index }) => index);

  if (usableIndexes.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * usableIndexes.length);
  return usableIndexes[randomIndex];
}

export function battleReducer(state: BattleState, action: BattleAction): BattleState {
  switch (action.type) {
    case "PLAYER_MOVE":
      return { ...state, player: consumeMove(state.player, action.index) };
    case "ENEMY_MOVE":
      return { ...state, enemy: consumeMove(state.enemy, action.index) };
    case "SET_PLAYER":
      return { ...state, player: action.fighter };
    case "SET_ENEMY":
      return { ...state, enemy: action.fighter };
    case "ADD_LOG":
      return { ...state, log: [...state.log, ...action.lines] };
    case "SET_STATUS":
      return { ...state, status: action.status };
    case "RESET":
      return createInitialState();
    default:
      return state;
  }
}

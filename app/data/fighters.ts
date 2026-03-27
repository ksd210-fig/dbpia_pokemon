import type { Fighter } from "../types/battle";

export const INITIAL_PLAYER: Fighter = {
  name: "대학원생",
  hp: 50,
  maxHp: 50,
  level: 7,
  moves: [
    { name: "DBpia AI 활용", damage: 90, pp: 5, maxPp: 5 },
    { name: "교수님 소환", damage: 0, selfDamage: 20, pp: 3, maxPp: 3 },
    { name: "째려보기", damage: 0, pp: 10, maxPp: 10 },
    { name: "커피 수혈", damage: 0, healAmount: 12, pp: 2, maxPp: 2 },
  ],
};

export const INITIAL_ENEMY: Fighter = {
  name: "논문",
  hp: 100,
  maxHp: 100,
  level: 50,
  moves: [
    { name: "리뷰어 #2 소환", damage: 15, pp: 99, maxPp: 99 },
    { name: "메이저 리비전", damage: 30, pp: 3, maxPp: 3 },
    { name: "참고문헌 추가 요청", damage: 5, pp: 5, maxPp: 5 },
    { name: "영문법 수정 요청", damage: 10, pp: 3, maxPp: 3 },
  ],
};

export const TURN_DELAY_MS = 450;
/** 로그 한 문장 표시 시간 (ms) */
export const MESSAGE_DELAY_MS = 1200;

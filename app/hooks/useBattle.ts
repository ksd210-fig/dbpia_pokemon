"use client";

import { useEffect, useReducer, useRef } from "react";
import {
  battleReducer,
  createInitialState,
  consumeMove,
  applyMove,
  pickRandomUsableMoveIndex,
} from "../lib/battleLogic";
import { TURN_DELAY_MS, MESSAGE_DELAY_MS } from "../data/fighters";

export function useBattle() {
  const [state, dispatch] = useReducer(battleReducer, undefined, createInitialState);
  const logRef = useRef<HTMLDivElement | null>(null);
  const latestStateRef = useRef(state);
  const turnTokenRef = useRef(0);

  useEffect(() => {
    latestStateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [state.log]);

  const runPlayerTurn = (moveIndex: number) => {
    const snapshot = latestStateRef.current;
    if (snapshot.status !== "idle") return;

    const selectedMove = snapshot.player.moves[moveIndex];
    if (!selectedMove || selectedMove.pp <= 0) return;

    const token = turnTokenRef.current + 1;
    turnTokenRef.current = token;

    dispatch({ type: "SET_STATUS", status: "processing" });

    const playerAfterUse = consumeMove(snapshot.player, moveIndex);
    const playerMove = playerAfterUse.moves[moveIndex];
    const playerResult = applyMove(playerAfterUse, snapshot.enemy, playerMove);

    dispatch({ type: "PLAYER_MOVE", index: moveIndex });
    dispatch({ type: "ADD_LOG", lines: [`대학원생은 ${playerMove.name}을 사용했다!`] });

    // t+1200ms: HP 갱신
    window.setTimeout(() => {
      if (turnTokenRef.current !== token) return;
      dispatch({ type: "SET_PLAYER", fighter: playerResult.attacker });
      dispatch({ type: "SET_ENEMY", fighter: playerResult.defender });

      // t+2400ms: 효과 메시지
      window.setTimeout(() => {
        if (turnTokenRef.current !== token) return;
        if (playerResult.resultLine) {
          dispatch({ type: "ADD_LOG", lines: [playerResult.resultLine] });
        }

        const afterEffectDelay = playerResult.resultLine ? MESSAGE_DELAY_MS : 0;

        // 효과 메시지 표시 후: 사망 체크 or 적 턴
        window.setTimeout(() => {
          if (turnTokenRef.current !== token) return;

          if (playerResult.defender.hp <= 0) {
            dispatch({ type: "ADD_LOG", lines: ["논문 게제 승인이 났다! 축하합니다!"] });
            dispatch({ type: "SET_STATUS", status: "won" });
            return;
          }

          // 적 턴 시작
          window.setTimeout(() => {
            if (turnTokenRef.current !== token) return;
            if (latestStateRef.current.status !== "processing") return;

            const enemyMoveIndex = pickRandomUsableMoveIndex(playerResult.defender);
            if (enemyMoveIndex === null) {
              dispatch({ type: "ADD_LOG", lines: ["논문은 지쳐서 쓰러졌다!"] });
              dispatch({ type: "SET_STATUS", status: "won" });
              return;
            }

            const enemyAfterUse = consumeMove(playerResult.defender, enemyMoveIndex);
            const enemyMove = enemyAfterUse.moves[enemyMoveIndex];
            const enemyResult = applyMove(enemyAfterUse, playerResult.attacker, enemyMove);

            dispatch({ type: "ENEMY_MOVE", index: enemyMoveIndex });
            dispatch({ type: "ADD_LOG", lines: [`논문은 ${enemyMove.name}을(를) 사용했다!`] });

            // t+1200ms: HP 갱신
            window.setTimeout(() => {
              if (turnTokenRef.current !== token) return;
              dispatch({ type: "SET_ENEMY", fighter: enemyResult.attacker });
              dispatch({ type: "SET_PLAYER", fighter: enemyResult.defender });

              // t+2400ms: 효과 메시지
              window.setTimeout(() => {
                if (turnTokenRef.current !== token) return;
                if (enemyResult.resultLine) {
                  dispatch({ type: "ADD_LOG", lines: [enemyResult.resultLine] });
                }

                const afterEnemyEffectDelay = enemyResult.resultLine ? MESSAGE_DELAY_MS : 0;

                // 효과 메시지 표시 후: 사망 체크 or 다음 턴
                window.setTimeout(() => {
                  if (turnTokenRef.current !== token) return;

                  if (enemyResult.defender.hp <= 0) {
                    dispatch({ type: "ADD_LOG", lines: ["대학원생은 쓰러졌다..."] });
                    dispatch({ type: "SET_STATUS", status: "lost" });
                    return;
                  }

                  dispatch({ type: "SET_STATUS", status: "idle" });
                }, afterEnemyEffectDelay);
              }, MESSAGE_DELAY_MS);
            }, MESSAGE_DELAY_MS);
          }, TURN_DELAY_MS);
        }, afterEffectDelay);
      }, MESSAGE_DELAY_MS);
    }, MESSAGE_DELAY_MS);
  };

  const handleRestart = () => {
    turnTokenRef.current += 1;
    dispatch({ type: "RESET" });
  };

  return { state, logRef, runPlayerTurn, handleRestart };
}

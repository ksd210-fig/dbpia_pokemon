"use client";

import { useEffect, useReducer, useRef } from "react";
import {
  battleReducer,
  createInitialState,
  consumeMove,
  applyMove,
  pickRandomUsableMoveIndex,
} from "../lib/battleLogic";
import { TURN_DELAY_MS } from "../data/fighters";

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
    dispatch({ type: "SET_PLAYER", fighter: playerResult.attacker });
    dispatch({ type: "SET_ENEMY", fighter: playerResult.defender });
    dispatch({
      type: "ADD_LOG",
      lines: [`대학원생은 ${playerMove.name}을 사용했다!`, playerResult.resultLine],
    });

    if (playerResult.defender.hp <= 0) {
      dispatch({ type: "ADD_LOG", lines: ["교수님을 무찌르고 승리했다!"] });
      dispatch({ type: "SET_STATUS", status: "won" });
      return;
    }

    window.setTimeout(() => {
      if (turnTokenRef.current !== token) return;

      const current = latestStateRef.current;
      if (current.status !== "processing") return;

      const enemyMoveIndex = pickRandomUsableMoveIndex(current.enemy);
      if (enemyMoveIndex === null) {
        dispatch({ type: "ADD_LOG", lines: ["교수님은 지쳐서 쓰러졌다!"] });
        dispatch({ type: "SET_STATUS", status: "won" });
        return;
      }

      const enemyAfterUse = consumeMove(current.enemy, enemyMoveIndex);
      const enemyMove = enemyAfterUse.moves[enemyMoveIndex];
      const enemyResult = applyMove(enemyAfterUse, current.player, enemyMove);

      dispatch({ type: "ENEMY_MOVE", index: enemyMoveIndex });
      dispatch({ type: "SET_ENEMY", fighter: enemyResult.attacker });
      dispatch({ type: "SET_PLAYER", fighter: enemyResult.defender });
      dispatch({
        type: "ADD_LOG",
        lines: [`교수님은 ${enemyMove.name}을(를) 사용했다!`, enemyResult.resultLine],
      });

      if (enemyResult.defender.hp <= 0) {
        dispatch({ type: "ADD_LOG", lines: ["대학원생은 쓰러졌다..."] });
        dispatch({ type: "SET_STATUS", status: "lost" });
        return;
      }

      dispatch({ type: "SET_STATUS", status: "idle" });
    }, TURN_DELAY_MS);
  };

  const handleRestart = () => {
    turnTokenRef.current += 1;
    dispatch({ type: "RESET" });
  };

  return { state, logRef, runPlayerTurn, handleRestart };
}
